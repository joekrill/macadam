import { Session } from "@ory/kratos-client";
import { ensure as ensureError } from "errorish";
import { Middleware } from "koa";

export const lazyLoadSession =
  (): Middleware =>
  (ctx, next): Promise<void> => {
    if (ctx.state.hasOwnProperty("session")) {
      return next();
    }

    let session: Session | undefined;
    let loaded = false;

    // Creates a lazy-loaded "session" property on our state object
    Object.defineProperty(ctx.state, "session", {
      get: async function () {
        if (!loaded) {
          try {
            ctx.state.log.debug(
              { cookies: ctx.request.headers["cookie"] },
              "Fetching Kratos session"
            );
            const response = await ctx.kratosPublicApi.toSession(
              undefined,
              ctx.request.headers["cookie"]
            );
            session = response.data;
            ctx.state.log.debug({ session }, "Kratos session received");
          } catch (caughtError) {
            const error = ensureError(caughtError);
            ctx.state.log.error(
              {
                stack: error.stack,
                type: error.name,
              },
              `Error fetching kratos session: ${error.message}`
            );
          } finally {
            loaded = true;
          }
        }

        return session;
      },
    });

    return next();
  };
