import cors from "@koa/cors";
import { MikroORM } from "@mikro-orm/core";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import { Logger } from "pino";
import { ormConfig } from "./entities";
import { entityManager } from "./entityManager";
import { logging } from "./logging";
import { metricsCollector, metricsResults } from "./metrics";
import { requestId } from "./requestId";
import { responseTime } from "./responseTime";
import { router } from "./routes";

export interface AppOptions {
  apiUrlPrefix: string;
  dbUrl: string;
  environment: string;
  logger: Logger;
  metricsPath: string;
}

export const createApp = async ({
  apiUrlPrefix,
  environment,
  dbUrl,
  logger,
  metricsPath,
}: AppOptions) => {
  const healthPath = "/healthz";

  const app = new Koa();
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
  app.use(
    bodyParser({
      enableTypes: ["json"],
      jsonLimit: "5mb",
      strict: true,
      onerror: function (err, ctx) {
        ctx.throw("body parse error", 422);
      },
    })
  );

  app.use(metricsResults({ path: metricsPath }));

  // Create a scoped entity manager for each request.
  app.use(entityManager({ orm }));

  // Finally, use API routes
  router.prefix(apiUrlPrefix);
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
