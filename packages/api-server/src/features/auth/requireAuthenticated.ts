import { Context, Middleware } from "koa";

/**
 * Returns Middleware which ensures the current user is authenticated.
 */
export const requireAuthenticated =
  (): Middleware =>
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    const session = await ctx.state.session;
    if (!session) {
      return ctx.throw(401);
    }

    await next();
  };
