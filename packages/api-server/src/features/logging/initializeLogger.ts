import Koa from "koa";
import pino from "pino";
import { logOnError } from "./logOnError.js";

export interface LoggerContext {
  logger: pino.Logger<string>;
}

export interface LoggerState {
  logger: pino.Logger<string>;
}

export interface InitializeLoggerOptions {
  logger: pino.Logger<string>;
}

/**
 * Adds a logger to the application context, and a request-scoped logger the
 * the state for each request.
 */
export const initializeLogger = (
  app: Koa,
  { logger }: InitializeLoggerOptions,
) => {
  app.context.logger = logger;
  app.on("error", logOnError(logger));
};
