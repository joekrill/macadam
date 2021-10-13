import { Configuration, Session, V0alpha1Api } from "@ory/kratos-client";
import { ensure as ensureError } from "errorish";
import { Middleware } from "koa";

export interface SessionState {
  kratos: V0alpha1Api;
  session?: Promise<Session>;
}

export interface SessionOptions {
  publicUrl: string;
}

/**
 * Returns Middleware which adds a `session` property to the state which
 * is a promise that attempts to return the current user session.
 */
export const authentication = ({ publicUrl }: SessionOptions): Middleware => {
  const kratos = new V0alpha1Api(new Configuration({ basePath: publicUrl }));

  return async (ctx, next: () => Promise<void>): Promise<void> => {
    ctx.state.kratos = kratos;
    let session: Session;
    let loaded = false;

    // Creates a lazy-loaded "session" property on our state.
    Object.defineProperty(ctx.state, "session", {
      get: async function () {
        if (!loaded) {
          try {
            const response = await kratos.toSession(
              undefined,
              ctx.request.headers["cookie"]
            );
            session = response.data;
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

    await next();
  };
};
