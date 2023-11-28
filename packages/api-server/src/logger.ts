import { diag, DiagLogger, DiagLogLevel } from "@opentelemetry/api";
import assert from "assert";
import pino from "pino";

export const logger = pino(
  {
    serializers: pino.stdSerializers,
    transport: process.env.LOG_PRETTY
      ? {
          target: "pino-pretty",
        }
      : undefined,
  },
  pino.destination({ sync: false }),
);

export const levels = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

// Sanity check to make sure that `lavels` contains all default pino levels
assert.deepEqual(
  Object.keys(logger.levels.values).sort(),
  [...levels].sort(),
  "Mismatch pino levels. Please fix `levels` to match the actual level names specific by pino",
);

class PinoDiagLogger implements DiagLogger {
  readonly logger: pino.Logger;
  constructor(logger: pino.Logger) {
    this.logger = logger.child({});
  }

  error(message: string, ...args: unknown[]) {
    this.logger.error(message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.logger.warn(message, ...args);
  }

  info(message: string, ...args: unknown[]) {
    this.logger.info(message, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    this.logger.debug(message, ...args);
  }

  verbose(message: string, ...args: unknown[]) {
    this.logger.trace(message, ...args);
  }
}

diag.setLogger(new PinoDiagLogger(logger), {
  logLevel: DiagLogLevel.INFO,
});
