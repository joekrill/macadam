import { packRules } from "@casl/ability/extra";
import Router from "@koa/router";
import { DefaultState } from "koa";
import { ability, AbilityState } from "../../../features/auth/ability";

export const userRouter = new Router<DefaultState & AbilityState>();

userRouter.use(ability()).get("/permissions", async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    data: {
      rules: packRules(ctx.state.ability?.rules || []),
    },
  };
});
