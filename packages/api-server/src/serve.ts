import { ensure as ensureError } from "errorish";
import Koa from "koa";
import pino from "pino";

export const logger = pino(
  { serializers: pino.stdSerializers },
  pino.destination({ sync: false })
);

process.on("uncaughtException", (error) => {
  logger.error(error, "uncaughtException");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error({ reason, promise }, "unhandledRejection");
  process.exit(1);
});

export const serve = (app: Koa, port: number, hostname: string) => {
  try {
    const apiServer = app.listen(port, hostname, () => {
      const address = apiServer.address() || {};
      const addressInfo = typeof address === "string" ? { address } : address;
      logger.info(
        {
          ...addressInfo,
          environment: app.env,
          logLevel: logger.level,
        },
        `🛣️ ${app.context.appName} server listening`
      );

      app.on("shutdown", () => {
        apiServer.close();
      });
    });
  } catch (error) {
    logger.error(ensureError(error), "Error running server");
    process.exit(1);
  }
};
