import { packRules } from "@casl/ability/extra";
import Router from "@koa/router";
import { DefaultState } from "koa";
import { ability, AbilityState } from "../../../features/auth/ability.js";

export const usersRouter = new Router<DefaultState & AbilityState>();

usersRouter
  .use(ability())
  .get("/whoami", async (ctx) => {
    const session = await ctx.state.session();

    ctx.status = 200;
    ctx.body = {
      data: {
        session,
        rules: packRules(ctx.state.ability?.rules || []),
      },
    };
  })
  .get("/permissions", async (ctx) => {
    ctx.status = 200;
    ctx.body = {
      data: {
        rules: packRules(ctx.state.ability?.rules || []),
      },
    };
  });
