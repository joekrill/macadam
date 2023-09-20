import { DefaultState, Middleware } from "koa";
import pino from "pino";

export interface LogRequestsOptions {
  pathLevels?: Record<string, "warn" | "info" | "debug" | "trace">;
}

export const logRequests =
  (logger: pino.Logger, options?: LogRequestsOptions): Middleware =>
  async (ctx, next): Promise<void> => {
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
                  _props: Object.keys(state).filter((key) => !!state[key]),
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
      },
    );

    await next();
    const logMethod = options?.pathLevels?.[ctx.path] || "info";
    ctx.state.logger[logMethod](
      {
        req: ctx.req,
        res: ctx.res,
        responseTime: ctx.state.responseTime,
      },
      "request",
    );
  };
