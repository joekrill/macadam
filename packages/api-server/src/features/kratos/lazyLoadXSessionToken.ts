import { Middleware } from "koa";

export const lazyLoadXSessionToken =
  (): Middleware =>
  (ctx, next): Promise<void> => {
    if (Object.getOwnPropertyDescriptor(ctx.state, "xSessionToken")) {
      return next();
    }

    let xSessionToken: string | undefined = undefined;
    let loaded = false;

    Object.defineProperties(ctx.state, {
      // This can be used to get the session only if already fetched.
      xSessionToken: {
        get: () => {
          if (!loaded) {
            const authHeader = ctx.headers["authorization"]?.toLowerCase();
            if (
              typeof authHeader === "string" &&
              authHeader.startsWith("bearer ")
            ) {
              xSessionToken = authHeader.substring(7).trim() || undefined;
            }

            loaded = true;
          }

          return xSessionToken;
        },
      },
    });

    return next();
  };
