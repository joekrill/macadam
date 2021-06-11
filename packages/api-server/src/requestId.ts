import { Context, Middleware } from "koa";
import { v4 } from "uuid";

export interface RequestIdState {
  requestId?: string;
}

export const requestId =
  (): Middleware<RequestIdState> =>
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    if (!ctx.state.requestId) {
      ctx.state.requestId = ctx.request.headers["x-request-id"] || v4();
    }

    ctx.set("Request-ID", ctx.state.requestId);
    await next();
  };
