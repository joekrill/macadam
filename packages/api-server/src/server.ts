import { ensure as ensureError } from "errorish";
import pino from "pino";
import { createApp } from "./app";

export const logger = pino({ serializers: pino.stdSerializers });

const finalLogger = pino.final(logger);

process.on("uncaughtException", (error) => {
  finalLogger.error(error, "uncaughtException");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  finalLogger.error({ reason, promise }, "unhandledRejection");
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
  KRATOS_PUBLIC_URL,
} = process.env;

const environment = NODE_ENV || "development";
const port = parseInt(PORT || "", 10) || 4000;
const host = LISTEN_ADDRESS || "0.0.0.0";

if (typeof DB_URL !== "string") {
  finalLogger.error("DB_URL environment variable not supplied");
  process.exit(2);
}

if (typeof KRATOS_PUBLIC_URL !== "string") {
  finalLogger.error("KRATOS_PUBLIC_URL environment variable not supplied");
  process.exit(2);
}

(async () => {
  try {
    const app = await createApp({
      dbUrl: DB_URL,
      environment,
      healthPath: HEALTH_PATH,
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
        },
        "🛣️  Macadam API server listening"
      );
    });
  } catch (error) {
    finalLogger.error(ensureError(error), "Error running server");
    process.exit(1);
  }
})();
