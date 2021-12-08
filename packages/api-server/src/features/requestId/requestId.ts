import { Middleware } from "koa";
import { v4 } from "uuid";

export interface RequestIdState {
  requestId?: string;
}

export interface RequestIdOptions {
  /**
   * The headers that will be trusted as a predefined requestId if they are
   * set. These should be supplied in preferred order, as the first match
   * will be used.
   */
  incomingHeaders?: string[];

  /**
   * The header to set for responses and for use in other tracing contexts
   */
  outgoingHeader?: string;
}

const DEFAULT_INCOMING_HEADERS = ["request-id", "x-request-id"];

const DEFAULT_OUTGOING_HEADER = "Request-ID";

/**
 * Returns Middleware which adds a `requestId` property to the current
 * state and generates a `Request-ID` response header.
 *
 * If a `Request-ID` or `X-Request-ID` header was provided, the value
 * is taken from that; otherwise a unique UUID is generated automatically.
 */
export const requestId =
  ({
    incomingHeaders = DEFAULT_INCOMING_HEADERS,
    outgoingHeader = DEFAULT_OUTGOING_HEADER,
  }: RequestIdOptions = {}): Middleware =>
  async (ctx, next): Promise<void> => {
    if (!ctx.state.requestId) {
      let incomingRequestId: string | undefined;

      for (const header of incomingHeaders) {
        const value = ctx.request.headers[header];
        incomingRequestId = Array.isArray(value) ? value[0] : value;
        if (incomingRequestId) {
          break;
        }
      }

      ctx.state.requestId = incomingRequestId || v4();
    }

    ctx.set(outgoingHeader, ctx.state.requestId);
    await next();
  };
