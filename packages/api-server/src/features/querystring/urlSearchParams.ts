import { Middleware } from "koa";

export interface URLSearchParamsState {
  urlSearchParams: URLSearchParams;
}

/**
 * Returns Middleware which adds a `urlSearchParams` property to the state
 * which returns a URLSearchParams instance representing the current
 * request's query string.
 */
export const urlSearchParams =
  (): Middleware =>
  async (ctx, next: () => Promise<void>): Promise<void> => {
    let urlSearchParams: URLSearchParams | undefined = undefined;
    let querystring: string | undefined;

    Object.defineProperty(ctx.state, "urlSearchParams", {
      get: function () {
        // lazy-parse the URLSearchParams only when it's requested, and if
        // the querystring is at some point changed, re-parse it.
        if (!urlSearchParams || querystring !== ctx.request.querystring) {
          querystring = ctx.request.querystring;
          urlSearchParams = new URLSearchParams(ctx.request.querystring);
        }

        return urlSearchParams;
      },
    });
    await next();
  };
