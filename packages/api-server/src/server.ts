import { ensure as ensureError } from "errorish";
import Koa from "koa";
import pino from "pino";
import { z } from "zod";

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

export const configSchema = z
  .object({
    DB_URL: z.string(),
    HEALTH_PATH: z.string().default("/health"),
    KRATOS_DB_URL: z.string(),
    KRATOS_PUBLIC_URL: z.string(),
    LISTEN_ADDRESS: z.string().default("0.0.0.0"),
    LOG_LEVEL: z
      .string()
      .refine((level) => !!logger.levels.values[level], {
        message: `LOG_LEVEL must be one of: ${Object.keys(
          logger.levels.values
        )}`,
      })
      .optional(),
    METRICS_PATH: z.string().default("/metrics"),
    NODE_ENV: z.string().default("development"),
    PORT: z
      .string()
      .default("4000")
      .transform((value) => parseInt(value, 10)),
    SENTRY_DSN: z.string().optional(),
    SENTRY_TUNNELABLE_DSNS: z.string().optional(),
  })
  .transform((result) => ({
    ...result,
    LOG_LEVEL:
      result.LOG_LEVEL ||
      (result.NODE_ENV === "development" ? "debug" : "info"),
  }));

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
  logger.error(parsedConfig.error);
  process.exit(2);
}

const { data: config } = parsedConfig;

export const start = (app: Koa, port: number, hostname: string) => {
  try {
    // const app = await createApiApp({
    //   dbUrl: config.DB_URL,
    //   environment: config.NODE_ENV,
    //   healthPath: config.HEALTH_PATH,
    //   kratosDbUrl: config.KRATOS_DB_URL,
    //   kratosPublicUrl: config.KRATOS_PUBLIC_URL,
    //   logger,
    //   metricsPath: config.METRICS_PATH,
    //   sentryDsn: config.SENTRY_DSN,
    //   sentryTunnelableDsns: config.SENTRY_TUNNELABLE_DSNS?.split(","),
    // });

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

// start();
