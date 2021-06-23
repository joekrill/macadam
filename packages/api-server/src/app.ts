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
  apiPath?: string;
  dbUrl: string;
  environment?: string;
  logger: Logger;
  healthPath?: string;
  metricsPath?: string;
  sentryDsn?: string;
}

export const createApp = async ({
  environment = "development",
  dbUrl,
  logger,
  apiPath = "/api",
  healthPath = "/health",
  metricsPath = "/metrics",
  sentryDsn,
}: AppOptions) => {
  const app = new Koa();

  if (sentryDsn) {
    // TODO: Properly shutdown: https://docs.sentry.io/platforms/node/guides/koa/configuration/draining/
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
  }

  const orm = await MikroORM.init(ormConfig({ environment, clientUrl: dbUrl }));

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
  app.use(
    helmet({
      // TODO: Figure out what this should be!
      contentSecurityPolicy: false,
    })
  );
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
