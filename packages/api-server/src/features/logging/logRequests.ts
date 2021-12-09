import { ensure as ensureError } from "errorish";
import { Middleware } from "koa";

export interface LogRequestsOptions {
  pathLevels?: Record<string, "warn" | "info" | "debug" | "trace">;
}

export const logRequests =
  (options?: LogRequestsOptions): Middleware =>
  async (ctx, next): Promise<void> => {
    try {
      await next();
      const logMethod = options?.pathLevels?.[ctx.path] || "info";
      ctx.state.logger[logMethod](
        {
          req: ctx.req,
          res: ctx.res,
          responseTime: ctx.state.responseTime,
        },
        "request"
      );
    } catch (caughtError) {
      const error = ensureError(caughtError);
      ctx.status =
        typeof (error as any).status === "number" ? (error as any).status : 500;
      ctx.body = error.message;
      ctx.state.logger.error(
        {
          stack: error.stack,
          type: error.name,
          state: ctx.state,
        },
        error.message
      );

      // TODO: Do we want to do this?
      // ctx.app.emit("error", error, ctx);
    }
  };
