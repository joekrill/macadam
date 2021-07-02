import Router from "@koa/router";
import compose from "koa-compose";

export interface HealthRoutesOptions {
  path: string;
}

export const healthRoutes = ({ path }: HealthRoutesOptions) => {
  const router = new Router({ prefix: path });

  router.get("/", (ctx) => {
    ctx.state.excludeFromMetrics = true;

    if (ctx.isTerminating || ctx.state.isTerminating === true) {
      ctx.status = 503;
      ctx.set("Connection", "close");
      return;
    }

    ctx.status = 200;
    ctx.body = { status: "ok" };
  });

  return compose([router.routes(), router.allowedMethods()]);
};
