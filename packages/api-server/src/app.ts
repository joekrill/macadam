import cors from "@koa/cors";
import Koa from "koa";
import { koaBody } from "koa-body";
import helmet from "koa-helmet";
import pino from "pino";
import { forkEntityManager } from "./features/db/forkEntityManager.js";
import { initializeDb } from "./features/db/initializeDb.js";
import { errorHandler } from "./features/errors/errorHandler.js";
import { notFound } from "./features/errors/notFound.js";
import { healthRoutes } from "./features/health/healthRoutes.js";
import { forkKratosEntityManager } from "./features/kratos/forkKratosEntityManager.js";
import {
  InitializeKratosOptions,
  initializeKratos,
} from "./features/kratos/initializeKratos.js";
import { initializeLogger } from "./features/logging/initializeLogger.js";
import { logRequests } from "./features/logging/logRequests.js";
import {
  InitializeMailerOptions,
  initializeMailer,
} from "./features/mailer/initializeMailer.js";
import { initializeMetrics } from "./features/metrics/initializeMetrics.js";
import { metricsRoutes } from "./features/metrics/metricsRoutes.js";
import { urlSearchParams } from "./features/querystring/urlSearchParams.js";
import { rateLimit } from "./features/rateLimit/rateLimit.js";
import { initializeRedis } from "./features/redis/initializeRedis.js";
import { requestId } from "./features/requestId/requestId.js";
import { responseTime } from "./features/responseTime/responseTime.js";
import {
  InitializeSentryOptions,
  initializeSentry,
} from "./features/sentry/initializeSentry.js";
import { initializeGracefulShutdown } from "./features/shutdown/initializeGracefulShutdown.js";
import { apiRoutes } from "./routes/index.js";

export interface AppOptions {
  /**
   * The base path to use for API endpoints. (i.e. "/api")
   */
  apiPath?: string;

  /**
   * The database connection URL.
   */
  dbUrl: string;

  /**
   * The default amount of time (in milliseconds) to give the application
   * to shutdown before forcefully exiting.
   */
  defaultShutdownWaitMs?: number;

  /**
   * The current runtime envinroment ("development", "production", etc.)
   */
  environment?: string;

  /**
   * The path to serve the health status from.
   */
  healthPath?: string;

  /**
   * Kratos configuration settings
   */
  kratos: InitializeKratosOptions;

  /**
   * The logging instance to use for writing messages.
   */
  logger: pino.Logger;

  /**
   * Mailer configuration settings
   */
  mailer?: InitializeMailerOptions;

  /**
   * The path to serve Prometheus-style metrics from
   */
  metricsPath?: string;

  /**
   * The connection URL to a redis instance to use (i.e. "redis://redis:6380/0")
   * for caching.
   */
  redisUrl?: string;

  /**
   * Sentry configuration settings.
   */
  sentry?: InitializeSentryOptions;
}

export const createApp = async ({
  apiPath = "/api",
  dbUrl,
  defaultShutdownWaitMs = 15000,
  environment = "development",
  healthPath = "/health",
  kratos,
  logger,
  mailer,
  metricsPath = "/metrics",
  redisUrl,
  sentry,
}: AppOptions) => {
  const app = new Koa({ env: environment });

  initializeLogger(app, { logger });
  initializeGracefulShutdown(app, { defaultShutdownWaitMs });
  initializeMetrics(app);

  if (sentry?.dsn) {
    initializeSentry(app, {
      release: process.env.npm_package_version,
      ...sentry,
    });
  }

  if (mailer) {
    initializeMailer(app, mailer);
  }

  await initializeDb(app, { clientUrl: dbUrl });
  await initializeKratos(app, kratos);

  if (redisUrl) {
    await initializeRedis(app, { url: redisUrl });
  }

  app.use(errorHandler());
  app.use(
    logRequests(logger, {
      pathLevels: {
        // Reduce logging levels for metrics and health endpoints because
        // they are only used internally.
        [metricsPath]: "trace",
        [healthPath]: "trace",
      },
    }),
  );
  app.use(urlSearchParams());
  app.use(responseTime());
  app.use(
    requestId({
      incomingHeaders: [
        "sentry-trace",
        "x-b3-traceid",
        "x-request-id",
        "request-id",
      ],
    }),
  );
  app.use(rateLimit());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());

  // Metrics and health routes don't need body parsing or entity manager,
  // so they can be applied first.
  app.use(metricsRoutes({ prefix: metricsPath }));
  app.use(healthRoutes({ prefix: healthPath }));

  // koa-body was preferred over koa-bodyparser because koa-bodyparser
  // replaces the body _no matter what_. Even if it's not one of the
  // "enableTypes" configured. And if it's not enabled, `rawBody` never
  // gets set, so you have no way of accessing the body after-the-fact
  app.use(
    koaBody({
      jsonLimit: "5mb",
    }),
  );

  // Create a scoped entity manager for each request.
  app.use(forkEntityManager());
  app.use(forkKratosEntityManager());

  // Lastly, register API routes
  app.use(apiRoutes({ prefix: apiPath }));
  app.use(notFound());

  return app;
};
