import Koa, { DefaultState } from "koa";
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
    ctx.state.logger = logger.child(
      { id: ctx.state.requestId },
      {
        serializers: {
          state: (state: DefaultState) =>
            typeof state === "object"
              ? {
                  requestId: state.requestId,
                  responseTime: state.responseTime,
                  session: state._session,
                  _keys: Object.keys(state).filter((key) => !!state[key]),
                }
              : `[could not serialize state: ${typeof state}]`,
        },
        redact: {
          // These aren't useful at all in our output and just bloat our logs.
          paths: [
            "state.ability",
            "state.entityManager",
            "state.kratosEntityManager",
            "state.logger",
            "state.metricsRegister",
            "state.session",
            "state.urlSearchParams",
          ],
          remove: true,
        },
      }
    );
    return next();
  });
};
