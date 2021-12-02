import Koa from "koa";
import pino from "pino";

export interface LoggerContext {
  logger: pino.Logger;
}

export interface LoggerState {
  logger: pino.Logger;
}

export interface InitializeLoggerOptions {
  logger: pino.Logger;
}

/**
 * Adds a logger to the application context, and a request-scoped logger the
 * the state for each request.
 */
export const initializeLogger = (
  app: Koa,
  { logger }: InitializeLoggerOptions
) => {
  app.context.logger = logger;

  app.use((ctx, next) => {
    ctx.state.logger = logger.child({ id: ctx.state.requestId });
    return next();
  });
};
