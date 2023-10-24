import { CanParameters } from "@casl/ability";
import {
  DefaultContext,
  DefaultState,
  Middleware,
  ParameterizedContext,
} from "koa";
import { AppAbility, AppAbilityTuple } from "./AppAbility.js";
import { abilityFor } from "./abilityFor.js";

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
    next: () => Promise<void>,
  ): Promise<void> => {
    if (!ctx.state.ability) {
      const session = await ctx.state.session();
      ctx.state.ability = abilityFor(session);
      ctx.state.entityManager?.setFilterParams("ability", {
        ability: ctx.state.ability,
      });
      ctx.state.kratosEntityManager?.setFilterParams("ability", {
        ability: ctx.state.ability,
      });
    }

    if (args.length === 2 || args.length === 3) {
      ctx.state.ability.ensureCan(...args);
    }

    await next();
  };
