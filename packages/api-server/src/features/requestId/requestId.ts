import { Context, Middleware } from "koa";
import { v4 } from "uuid";

export interface RequestIdState {
  requestId?: string;
}

/**
 * Returns Middleware which adds a `requestId` property to the current
 * state and generates a `Request-ID` response header.
 *
 * If a `Request-ID` or `X-Request-ID` header was provided, the value
 * is taken from that; otherwise a unique UUID is generated automatically.
 */
export const requestId =
  (): Middleware =>
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    if (!ctx.state.requestId) {
      const incomingRequestIdHeader =
        ctx.request.headers["request-id"] ||
        ctx.request.headers["x-request-id"];

      const incomingRequestId = Array.isArray(incomingRequestIdHeader)
        ? incomingRequestIdHeader[0]
        : incomingRequestIdHeader;

      ctx.state.requestId = incomingRequestId || v4();
    }

    ctx.set("Request-ID", ctx.state.requestId);
    await next();
  };
