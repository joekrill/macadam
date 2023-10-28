import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import compose from "koa-compose";

export interface MetricsRoutesOptions {
  /**
   * The URL path that should serve the metrics.
   */
  prefix: string;
}

/**
 * A router which outputs prometheus-style metrics at it's endpoint.
 */
export const metricsRoutes = ({ prefix }: MetricsRoutesOptions) => {
  const router = new Router<DefaultState, Context>({ prefix });

  router.get("/", async (ctx) => {
    ctx.state.excludeFromMetrics = true;

    if (ctx.metrics.registry) {
      ctx.set("Content-Type", ctx.metrics.registry.contentType);
      ctx.body = await ctx.metrics.registry.metrics();
    } else {
      ctx.throw(500, "`ctx.metrics.registry` was not defined");
    }
  });

  return compose([router.routes(), router.allowedMethods()]);
};
