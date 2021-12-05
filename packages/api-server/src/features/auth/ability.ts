import { Context, Middleware } from "koa";
import { abilityFor } from "./abilityFor";
import { AppAbility } from "./AppAbility";

export interface AbilityState {
  ability?: AppAbility;
}

/**
 * Returns Middleware which attaches the ability of the current user to state.
 */
export const ability =
  (): Middleware =>
  async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    if (!ctx.state.ability) {
      const session = await ctx.state.session;
      ctx.state.ability = abilityFor(session);
    }

    await next();
  };
