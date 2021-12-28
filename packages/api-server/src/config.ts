import { z } from "zod";
import { logger } from "./serve";

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
const { data } = parsedConfig;

export const config = {
  dbUrl: data.DB_URL,
  environment: data.NODE_ENV,
  healthPath: data.HEALTH_PATH,
  hostname: data.LISTEN_ADDRESS,
  kratosDbUrl: data.KRATOS_DB_URL,
  kratosPublicUrl: data.KRATOS_PUBLIC_URL,
  logger,
  metricsPath: data.METRICS_PATH,
  port: data.PORT,
  sentryDsn: data.SENTRY_DSN,
  sentryTunnelableDsns: data.SENTRY_TUNNELABLE_DSNS?.split(","),
};
