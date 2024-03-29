import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import compose from "koa-compose";

export interface HealthRoutesOptions {
  prefix: string;
}

/**
 * A router which outputs health status at it's endpoint.
 */
export const healthRoutes = ({ prefix }: HealthRoutesOptions) => {
  const router = new Router<DefaultState, Context>({
    prefix,
  });

  router.get("/", (ctx) => {
    ctx.state.excludeFromMetrics = true;

    if (ctx.isTerminating) {
      ctx.status = 503;
      ctx.body = { status: "terminating" };
      ctx.set("Connection", "close");
      return;
    }

    ctx.status = 200;
    ctx.body = { status: "ok" };
  });

  return compose([router.routes(), router.allowedMethods()]);
};
