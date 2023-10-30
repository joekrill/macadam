import { z } from "zod";
import { levels } from "./logger.js";

export const configSchema = z
  .object({
    DB_URL: z.string(),
    HEALTH_PATH: z.string().optional(),
    KRATOS_DB_URL: z.string(),
    KRATOS_PUBLIC_URL: z.string(),
    LISTEN_ADDRESS: z.string().ip().default("0.0.0.0"),
    LOG_LEVEL: z.enum(levels).optional(),
    METRICS_PATH: z.string().optional(),
    NODE_ENV: z.string().default("development"),
    PORT: z.coerce.number().default(4000),
    REDIS_URL: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
    SENTRY_TUNNELABLE_DSNS: z
      .string()
      .optional()
      .transform((dsns) => dsns?.split(",") || []),
    SMTP_MAIL_TO: z.string().optional(),
    SMTP_URI: z.string().optional(),
  })
  .transform((config) => ({
    ...config,
    LOG_LEVEL:
      config.LOG_LEVEL ||
      (config.NODE_ENV === "development" ? "debug" : "info"),
  }));

export type Config = z.infer<typeof configSchema>;
