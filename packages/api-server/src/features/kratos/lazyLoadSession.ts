import { Session } from "@ory/kratos-client";
import { ensure as ensureError } from "errorish";
import { Middleware } from "koa";
import { z } from "zod";

const unauthorizedErrorSchema = z.object({
  response: z.object({
    status: z.literal(401),
  }),
});

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
            ctx.state.logger.debug("Fetching Kratos session");
            const response = await ctx.kratosPublicApi.toSession(
              undefined,
              ctx.request.headers["cookie"]
            );
            session = response.data;
            ctx.state.logger.debug({ session }, "Kratos session received");
          } catch (caughtError) {
            if (unauthorizedErrorSchema.safeParse(caughtError).success) {
              ctx.state.logger.debug("Kratos session not found (Unauthorized)");
            } else {
              const error = ensureError(caughtError);
              ctx.state.logger.error(
                {
                  stack: error.stack,
                  type: error.name,
                },
                `Error fetching kratos session: ${error.message}`
              );
            }
          } finally {
            loaded = true;
          }
        }

        return session;
      },
    });

    return next();
  };
