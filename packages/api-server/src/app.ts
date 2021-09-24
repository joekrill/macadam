import cors from "@koa/cors";
import { MikroORM } from "@mikro-orm/core";
import * as Sentry from "@sentry/node";
import IORedis from "ioredis";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import { Logger } from "pino";
import { apiRoutes } from "./features/api";
import { authentication } from "./features/auth/authentication";
import { healthRoutes } from "./features/health/health";
import { logging } from "./features/logging/logging";
import { metricsCollector, metricsRoutes } from "./features/metrics/metrics";
import { ormConfig } from "./features/orm/config";
import { entityManager } from "./features/orm/entityManager";
import { rateLimit } from "./features/rateLimit/rateLimit";
import { requestId } from "./features/requestId/requestId";
import { responseTime } from "./features/responseTime/responseTime";

export interface AppOptions {
  /**
   * The base path to use for API endpoints.
   */
  apiPath?: string;

  /**
   * The database URL.
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
   * The endpoint for health status.
   */
  healthPath?: string;

  /**
   * The URL to the public API of the Kratos instance used for authentication.
   */
  kratosPublicUrl: string;

  /**
   * The logging instance to use for writing messages.
   */
  logger: Logger;

  /**
   * The path to serve Prometheus-style metrics from
   */
  metricsPath?: string;

  /**
   * The URL to the redis instance to use (i.e. "redis://redis:6380/0")
   */
  redisUrl?: string;

  /**
   * The URL of the Sentry instance to send crash reports to.
   */
  sentryDsn?: string;
}

export interface AppInstance extends Koa {
  /**
   * Gracefully shuts down the app instance, waiting a maximum of `waitMs`
   * milliseconds before forcefully stopping.
   */
  shutdown: (exitcode?: number, waitMs?: number) => Promise<void>;
}

export const createApp = async ({
  apiPath = "/api",
  dbUrl,
  defaultShutdownWaitMs = 15000,
  environment = "development",
  healthPath = "/health",
  kratosPublicUrl,
  logger,
  metricsPath = "/metrics",
  redisUrl,
  sentryDsn,
}: AppOptions) => {
  const app = new Koa() as AppInstance;

  /**
   * Gracefully shuts down the application, closing any open connections, etc,
   * and calling `process.exit` on completion if an `exitCode` was provided.
   * @param exitCode
   * @param waitMs
   */
  app.shutdown = async (
    exitCode?: number,
    waitMs: number = defaultShutdownWaitMs
  ) => {
    let shutdownTimeout: NodeJS.Timeout | number | undefined = undefined;
    const listeners = app.listeners("shutdown");

    try {
      logger.info(
        { exitCode, waitMs, listenerCount: listeners.length },
        `Preparing shutdown, notifying ${listeners.length} listeners`
      );
      await Promise.race([
        // Ideally let any processes cleanup and shutdown.
        Promise.all(listeners.map((listener) => listener())),

        // This provides a maximum wait time for the above -- after `maxWait`
        // this will resolve and win the `Promise.race`.
        new Promise<void>((resolve) => {
          shutdownTimeout = setTimeout(() => {
            logger.warn(`Forcing shutdown after waiting ${waitMs}ms`);
            resolve();
          }, waitMs);
        }),
      ]);
    } finally {
      logger.info({ exitCode }, "Shutting down");
      clearTimeout(shutdownTimeout);
      if (exitCode !== undefined) {
        process.exit(exitCode);
      }
    }
  };

  app.on("shutdown", () => {
    app.context.isTerminating = true;
  });

  // Intercept shutdowns so we can allow any listeners to cleanup,
  // but maintain exit codes.
  process.on("exit", (code) => app.shutdown(code));
  process.on("SIGHUP", () => app.shutdown(128 + 1));
  process.on("SIGINT", () => app.shutdown(128 + 2));
  process.on("SIGQUIT", () => app.shutdown(128 + 3));
  process.on("SIGTERM", () => app.shutdown(128 + 15));
  process.on("SIGBREAK", () => app.shutdown(128 + 21)); // Windows only

  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment,
      release: process.env.npm_package_version,
    });
    app.on("error", (err, ctx) => {
      Sentry.withScope(function (scope) {
        scope.addEventProcessor(function (event) {
          return Sentry.Handlers.parseRequest(event, ctx.request);
        });
        Sentry.captureException(err);
      });
    });

    app.on("shutdown", async () => {
      logger.debug("Closing Sentry connection");
      // See: https://docs.sentry.io/platforms/node/guides/koa/configuration/draining/
      await Sentry.close();
      logger.debug("Sentry connection closed");
    });
  }

  const orm = await MikroORM.init(ormConfig({ environment, clientUrl: dbUrl }));
  app.on("shutdown", async () => {
    logger.debug("Closing Database connection");
    await orm.close();
    logger.debug("Database connection closed");
  });

  const redis = redisUrl ? new IORedis(redisUrl) : undefined;
  if (redis) {
    await redis.connect();
    app.on("shutdown", async () => {
      logger.debug("Closing Redis connection");
      await redis.disconnect(false);
      logger.debug("Redis connection closed");
    });
  }

  app.use(
    logging(logger, {
      pathLevels: {
        [metricsPath]: "trace",
        [healthPath]: "trace",
      },
    })
  );
  app.use(metricsCollector());
  app.use(responseTime());
  app.use(requestId());
  app.use(rateLimit({ redis }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());

  // Metrics and health routes don't need body parsing or entity manager.
  app.use(metricsRoutes({ path: metricsPath }));
  app.use(healthRoutes({ path: healthPath }));

  app.use(
    bodyParser({
      enableTypes: ["json"],
      jsonLimit: "5mb",
      strict: true,
      // onerror: function (err, ctx) {
      //   ctx.throw("body parse error", 422);
      // },
    })
  );

  app.use(authentication({ publicUrl: kratosPublicUrl }));

  // Create a scoped entity manager for each request.
  app.use(entityManager({ orm }));

  // Finally, register API routes
  app.use(apiRoutes({ prefix: apiPath }));

  return app;
};
