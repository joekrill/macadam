import { DefaultState, Middleware } from "koa";
import pino from "pino";

export interface LogRequestsOptions {
  pathLevels?: Record<string, "warn" | "info" | "debug" | "trace">;
}

export const logRequests =
  (logger: pino.Logger, options?: LogRequestsOptions): Middleware =>
  async (ctx, next): Promise<void> => {
    ctx.state.logger = logger.child(
      { requestId: ctx.state.requestId },
      {
        serializers: {
          state: ({
            _session,
            ability,
            entityManager,
            excludeFromMetrics,
            kratosEntityManager,
            logger,
            requestId,
            session,
            urlSearchParams,
            xSessionToken,
            responseTime,
            ...state
          }: DefaultState) => ({
            session: _session
              ? {
                  id: _session.id,
                  identityId: _session.identity.id,
                  active: _session.active,
                  aal: _session.authenticator_assurance_level,
                  authenticated_at: _session.authenticated_at,
                  issued_at: _session.issued_at,
                  expires_at: _session.expires_at,
                }
              : null,
            excludeFromMetrics,
            requestId,

            // Anything else just output a list of property names.
            additionalProps: Object.keys(state).filter((key) => !!state[key]),
          }),
        },
      },
    );

    await next();
    const logMethod = options?.pathLevels?.[ctx.path] || "info";
    ctx.state.logger[logMethod](
      {
        requestId: ctx.state.requestId,
        responseTime: ctx.state.responseTime,
        state: ctx.state,
        req: ctx.req,
        res: ctx.res,
      },
      "request",
    );
  };
