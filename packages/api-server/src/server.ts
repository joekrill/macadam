import { ensure as ensureError } from "errorish";
import { createApp } from "./app.js";
import { configSchema } from "./config.js";
import { logger } from "./logger.js";

process.on("uncaughtException", (error) => {
  logger.error(error, "uncaughtException");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    { reason, promise, stack: ensureError(reason).stack },
    "unhandledRejection",
  );
  process.exit(1);
});

(async () => {
  try {
    const config = configSchema.parse(process.env);
    logger.level = config.LOG_LEVEL;

    const app = await createApp({
      dbUrl: config.DB_URL,
      environment: config.NODE_ENV,
      healthPath: config.HEALTH_PATH,
      kratos: {
        clientUrl: config.KRATOS_DB_URL,
        publicUrl: config.KRATOS_PUBLIC_URL,
      },
      logger,
      mailer:
        config.SMTP_MAIL_TO && config.SMTP_URI
          ? {
              smtpMailTo: config.SMTP_MAIL_TO,
              smtpUri: config.SMTP_URI,
            }
          : undefined,
      metricsPath: config.METRICS_PATH,
      redisUrl: config.REDIS_URL,
      sentry: config.SENTRY_DSN
        ? {
            dsn: config.SENTRY_DSN,
            tunnelableDsns: config.SENTRY_TUNNELABLE_DSNS,
          }
        : undefined,
    });

    const apiServer = app.listen(config.PORT, config.LISTEN_ADDRESS, () => {
      const address = apiServer.address() || {};
      const addressInfo = typeof address === "string" ? { address } : address;
      logger.info(
        {
          ...addressInfo,
          environment: config.NODE_ENV,
          logLevel: logger.level,
        },
        "🛣️  Macadam API server listening",
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
