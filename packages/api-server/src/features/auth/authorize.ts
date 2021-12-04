import { Context, Middleware } from "koa";
import { abilityFor, AppAbility } from "./abilities";

export interface AuthorizeState {
  ability?: AppAbility;
}

/**
 * Returns Middleware which attaches the ability of the current user to state.
 */
export const authorize =
  (): Middleware =>
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    if (!ctx.state.ability) {
      const session = await ctx.state.session;
      ctx.state.ability = abilityFor(session);
    }

    await next();
  };
