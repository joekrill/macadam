import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import compose from "koa-compose";

export interface MetricsRoutesOptions {
  /**
   * The URL path that should serve the metrics.
   */
  path: string;
}

/**
 * A router which outputs prometheus-style metrics at it's endpoint.
 */
export const metricsRoutes = ({ path }: MetricsRoutesOptions) => {
  const router = new Router<DefaultState, Context>({ prefix: path });

  router.get("/", async (ctx) => {
    ctx.state.excludeFromMetrics = true;

    if (ctx.state.metricsRegister) {
      ctx.set("Content-Type", ctx.state.metricsRegister.contentType);
      ctx.body = await ctx.state.metricsRegister.metrics();
    } else {
      ctx.throw(500, "metricsRegister was not defined");
    }
  });

  return compose([router.routes(), router.allowedMethods()]);
};
