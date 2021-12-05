import { ensure as ensureError } from "errorish";
import pino from "pino";
import { createApp } from "./app";

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

const {
  DB_URL,
  HEALTH_PATH,
  LISTEN_ADDRESS,
  METRICS_PATH,
  NODE_ENV,
  PORT,
  SENTRY_DSN,
  KRATOS_DB_URL,
  KRATOS_PUBLIC_URL,
  LOG_LEVEL,
} = process.env;

const environment = NODE_ENV || "development";
const port = parseInt(PORT || "", 10) || 4000;
const host = LISTEN_ADDRESS || "0.0.0.0";

if (typeof DB_URL !== "string") {
  logger.error("DB_URL environment variable not supplied");
  process.exit(2);
}

if (typeof KRATOS_DB_URL !== "string") {
  logger.error("KRATOS_DB_URL environment variable not supplied");
  process.exit(2);
}

if (typeof KRATOS_PUBLIC_URL !== "string") {
  logger.error("KRATOS_PUBLIC_URL environment variable not supplied");
  process.exit(2);
}

if (environment === "development") {
  logger.level = "debug";
}

if (LOG_LEVEL && logger.levels.values[LOG_LEVEL]) {
  logger.level = LOG_LEVEL;
}

(async () => {
  try {
    const app = await createApp({
      dbUrl: DB_URL,
      environment,
      healthPath: HEALTH_PATH,
      kratosDbUrl: KRATOS_DB_URL,
      logger,
      metricsPath: METRICS_PATH,
      sentryDsn: SENTRY_DSN,
      kratosPublicUrl: KRATOS_PUBLIC_URL,
    });

    const apiServer = app.listen(port, host, () => {
      const address = apiServer.address() || {};
      const addressInfo = typeof address === "string" ? { address } : address;
      logger.info(
        {
          ...addressInfo,
          environment,
          logLevel: logger.level,
        },
        "🛣️  Macadam API server listening"
      );

      app.on("shutdown", () => {
        apiServer.close();
      });
    });
  } catch (error) {
    logger.error(ensureError(error), "Error running server");
    process.exit(1);
  }
})();
