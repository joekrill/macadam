import { CanParameters } from "@casl/ability";
import {
  DefaultContext,
  DefaultState,
  Middleware,
  ParameterizedContext,
} from "koa";
import { abilityFor } from "./abilityFor";
import { AppAbility, AppAbilityTuple } from "./AppAbility";

export interface AbilityState {
  ability?: AppAbility;
}

/**
 * Returns Middleware which attaches the ability of the current user to state.
 */
export const ability =
  (
    ...args: CanParameters<AppAbilityTuple> | []
  ): Middleware<DefaultState & AbilityState> =>
  async (
    ctx: ParameterizedContext<DefaultState & AbilityState, DefaultContext>,
    next: () => Promise<void>
  ): Promise<void> => {
    if (!ctx.state.ability) {
      const session = await ctx.state.session();
      ctx.state.ability = abilityFor(session);
    }

    if (args.length === 2 || args.length === 3) {
      ctx.state.ability.ensureCan(...args);
    }

    await next();
  };
