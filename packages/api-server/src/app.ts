import cors from "@koa/cors";
import Koa from "koa";
import koaBody from "koa-body";
import helmet from "koa-helmet";
import pino from "pino";
import { forkEntityManager } from "./features/db/forkEntityManager";
import { initializeDb } from "./features/db/initializeDb";
import { errorHandler } from "./features/errors/errorHandler";
import { healthRoutes } from "./features/health/healthRoutes";
import { forkKratosEntityManager } from "./features/kratos/forkKratosEntityManager";
import { initializeKratos } from "./features/kratos/initializeKratos";
import { initializeLogger } from "./features/logging/initializeLogger";
import { logRequests } from "./features/logging/logRequests";
import { metricsCollector } from "./features/metrics/metricsCollector";
import { metricsRoutes } from "./features/metrics/metricsRoutes";
import { urlSearchParams } from "./features/querystring/urlSearchParams";
import { rateLimit } from "./features/rateLimit/rateLimit";
import { initializeRedis } from "./features/redis/initializeRedis";
import { requestId } from "./features/requestId/requestId";
import { responseTime } from "./features/responseTime/responseTime";
import { initializeSentry } from "./features/sentry/initializeSentry";
import { initializeGracefulShutdown } from "./features/shutdown/initializeGracefulShutdown";

export interface AppOptions {
  /**
   * The name used to identify the application (for logging, etc)
   */
  appName: string;

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
   * The connection string URl for connecting directly to the Kratos database
   */
  kratosDbUrl: string;

  /**
   * The URL to the public API of the Kratos instance used for authentication.
   */
  kratosPublicUrl: string;

  /**
   * The logging instance to use for writing messages.
   */
  logger: pino.Logger;

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
   * The URL of the Sentry instance to send crash reports to.
   */
  sentryDsn?: string;

  /**
   * The URLs of any sentry DSNs that may be tunneled through the API server
   * @see {@link https://docs.sentry.io/platforms/javascript/troubleshooting/#dealing-with-ad-blockers}
   */
  sentryTunnelableDsns?: string[];
}

export const createApp = async ({
  appName,
  dbUrl,
  defaultShutdownWaitMs = 15000,
  environment = "development",
  healthPath = "/health",
  kratosDbUrl,
  kratosPublicUrl,
  logger,
  metricsPath = "/metrics",
  redisUrl,
  sentryDsn,
  sentryTunnelableDsns,
}: AppOptions) => {
  const app = new Koa({ env: environment });

  Object.defineProperty(app.context, "appName", {
    get: function () {
      return appName;
    },
  });

  initializeLogger(app, { logger });
  initializeGracefulShutdown(app, { defaultShutdownWaitMs });

  if (sentryDsn) {
    initializeSentry(app, {
      dsn: sentryDsn,
      release: process.env.npm_package_version,
      tunnelableDsns: sentryTunnelableDsns,
    });
  }

  await initializeDb(app, { clientUrl: dbUrl });
  await initializeKratos(app, {
    publicUrl: kratosPublicUrl,
    clientUrl: kratosDbUrl,
  });

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
    })
  );
  app.use(urlSearchParams());
  app.use(metricsCollector());
  app.use(responseTime());
  app.use(
    requestId({
      incomingHeaders: [
        "sentry-trace",
        "x-b3-traceid",
        "x-request-id",
        "request-id",
      ],
    })
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
    })
  );

  // Create a scoped entity manager for each request.
  app.use(forkEntityManager());
  app.use(forkKratosEntityManager());

  return app;
};
