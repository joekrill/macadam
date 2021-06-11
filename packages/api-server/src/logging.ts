import { Middleware, ParameterizedContext } from "koa";
import { Logger } from "pino";
import { RequestIdState } from "./requestId";
import { ResponseTimeState } from "./responseTime";

export interface LogState {
  log: Logger;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface LogOptions {
  pathLevels: Record<string, "warn" | "info" | "debug" | "trace">;
}

export const logging =
  (
    baseLogger: Logger,
    { pathLevels = {} }: Partial<LogOptions> = {}
  ): Middleware<ResponseTimeState & RequestIdState & LogState> =>
  async (
    ctx: ParameterizedContext<ResponseTimeState & RequestIdState & LogState>,
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
    } catch (error) {
      ctx.status = error.status || 500;
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
