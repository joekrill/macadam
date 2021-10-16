import { ensure as ensureError } from "errorish";
import { Middleware, ParameterizedContext } from "koa";
import pino from "pino";
import { RequestIdState } from "../requestId/requestId";
import { ResponseTimeState } from "../responseTime/responseTime";

export interface LoggingState {
  log: pino.Logger;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface LoggingOptions {
  pathLevels: Record<string, "warn" | "info" | "debug" | "trace">;
}

export const logging =
  (
    baseLogger: pino.Logger,
    { pathLevels = {} }: Partial<LoggingOptions> = {}
  ): Middleware<ResponseTimeState & RequestIdState & LoggingState> =>
  async (
    ctx: ParameterizedContext<
      ResponseTimeState & RequestIdState & LoggingState
    >,
    next: () => Promise<void>
  ): Promise<void> => {
    if (!ctx.state.log) {
      ctx.state.log = baseLogger.child({ id: ctx.state.requestId });
    }

    try {
      await next();
      const logMethod = pathLevels[ctx.path] || "info";
      ctx.state.log[logMethod](
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
      ctx.state.log.error(
        {
          stack: error.stack,
          type: error.name,
          state: ctx.state,
        },
        error.message
      );
      ctx.app.emit("error", error, ctx);
    }
  };
