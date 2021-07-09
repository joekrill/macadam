import cors from "@koa/cors";
import { MikroORM } from "@mikro-orm/core";
import * as Sentry from "@sentry/node";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import { Logger } from "pino";
import { apiRoutes } from "./features/api";
import { healthRoutes } from "./features/health/health";
import { logging } from "./features/logging/logging";
import { metricsCollector, metricsRoutes } from "./features/metrics/metrics";
import { ormConfig } from "./features/orm/config";
import { entityManager } from "./features/orm/entityManager";
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
   * The current runtime envinroment ("development", "production", etc.)
   */
  environment?: string;

  /**
   * The logging instance to use for writing messages.
   */
  logger: Logger;

  /**
   * The endpoint for health status.
   */
  healthPath?: string;

  /**
   * The path to serve Prometheus-style metrics from
   */
  metricsPath?: string;

  /**
   * The URL of the Sentry instance to send crash reports to.
   */
  sentryDsn?: string;

  /**
   * The default amount of time (in milliseconds) to give the application
   * to shutdown before forcefully exiting.
   */
  defaultShutdownWaitMs?: number;
}

export interface AppInstance extends Koa {
  /**
   * Gracefully shuts down the app instance, waiting a maximum of `waitMs`
   * milliseconds before forcefully stopping.
   */
  shutdown: (exitcode?: number, waitMs?: number) => Promise<void>;
}

export const createApp = async ({
  environment = "development",
  dbUrl,
  logger,
  apiPath = "/api",
  healthPath = "/health",
  metricsPath = "/metrics",
  sentryDsn,
  defaultShutdownWaitMs = 15000,
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
    try {
      await Promise.race([
        // Ideally let any processes cleanup and shutdown.
        Promise.all(app.listeners("shutdown").map((listener) => listener())),

        // This provides a maximum wait time for the above -- after `maxWait`
        // this will resolve and win the `Promise.race`.
        new Promise((resolve) => {
          shutdownTimeout = setTimeout(resolve, waitMs);
        }),
      ]);
    } finally {
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
      // See: https://docs.sentry.io/platforms/node/guides/koa/configuration/draining/
      await Sentry.close();
    });
  }

  const orm = await MikroORM.init(ormConfig({ environment, clientUrl: dbUrl }));
  app.on("shutdown", async () => {
    await orm.close();
  });

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

  // Create a scoped entity manager for each request.
  app.use(entityManager({ orm }));

  // Finally, register API routes
  app.use(apiRoutes({ prefix: apiPath }));

  return app;
};
