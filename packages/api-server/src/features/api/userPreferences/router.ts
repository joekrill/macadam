import Router from "@koa/router";
import { EntityRepository } from "@mikro-orm/core";
import { Context, DefaultState } from "koa";
import { requireAuthenticated } from "../../auth/requireAuthenticated";
import { UserPreference } from "../../orm/entities/UserPreference";

interface UserPreferenceRouterState extends DefaultState {
  userPreference?: UserPreference;
  userPreferenceRepository: EntityRepository<UserPreference>;
}

export const router = new Router<DefaultState, Context>();

(router as unknown as Router<UserPreferenceRouterState, Context>)
  .use(requireAuthenticated())
  .use(async (ctx, next) => {
    if (!ctx.state.entityManager) {
      return ctx.throw(500, "entityManager is not undefined!");
    }

    const userPreferenceRepository =
      ctx.state.entityManager?.getRepository(UserPreference);

    const session = await ctx.state.session;
    const id = session!.identity.id;

    ctx.state.userPreference =
      (await userPreferenceRepository.findOne({
        id,
      })) || new UserPreference(id);

    return next();
  })
  .get("/", async (ctx) => {
    ctx.body = ctx.state.userPreference?.preferences || {};
    ctx.status = 200;
  })
  .delete("/", async (ctx) => {
    const { userPreference, userPreferenceRepository } = ctx.state;

    if (!userPreference) {
      return ctx.throw(404);
    }

    try {
      await userPreferenceRepository.removeAndFlush(userPreference);
      ctx.status = 204;
    } catch (err) {
      ctx.status = 404;
    }
  });
