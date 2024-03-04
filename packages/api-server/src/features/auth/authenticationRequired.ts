import { Context, Middleware } from "koa";

/**
 * State that will be available after `authenticationRequired` middleware
 * has been applied.
 */
export interface AuthenticationRequiredState {
  identityId: string;
}

/**
 * Returns Middleware which ensures the current user is authenticated.
 */
export const authenticationRequired =
  (): Middleware =>
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    const session = await ctx.state.session();

    if (!session) {
      return ctx.throw(401);
    }

    ctx.state.identityId = session.identity?.id;

    await next();
  };
