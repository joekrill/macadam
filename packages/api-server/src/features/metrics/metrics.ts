import Router from "@koa/router";
import { Context, DefaultState, Middleware, ParameterizedContext } from "koa";
import compose from "koa-compose";
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from "prom-client";
import { ResponseTimeState } from "../responseTime/responseTime";

export interface MetricsState {
  /**
   * When set to `true` (by some other middleware, for example), will cause
   * a given request to not be included in metric collection.
   */
  excludeFromMetrics?: boolean;

  /**
   * The prometheus metrics registry for the current app middleware instance.
   */
  metricsRegister?: Registry;
}
export interface MetricsRoutesOptions {
  /**
   * The URL path that should serve the metrics.
   */
  path: string;
}

export const metricsRoutes = ({ path }: MetricsRoutesOptions) => {
  const router = new Router<DefaultState, Context>({ prefix: path });

  router.get("/", async (ctx) => {
    ctx.state.excludeFromMetrics = true;

    if (ctx.state.metricsRegister) {
      ctx.set("Content-Type", ctx.state.metricsRegister.contentType);
      ctx.body = await ctx.state.metricsRegister.metrics();
    } else {
      ctx.throw(500, "metricsRegister not defined on state");
    }
  });

  return compose([router.routes(), router.allowedMethods()]);
};

export const metricsCollector = (): Middleware => {
  const register = new Registry();
  collectDefaultMetrics({ register });

  const httpRequestCount = new Counter({
    name: "http_requests_total",
    help: "Number of HTTP requests",
    labelNames: ["method", "code"],
    registers: [register],
  });

  const httpRequestDurationSeconds = new Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["code", "path"],
    buckets: [0.01, 0.1, 0.25, 0.5, 1, 1.5, 5, 10],
    registers: [register],
  });

  return async (
    ctx: ParameterizedContext<MetricsState & ResponseTimeState>,
    next: () => Promise<void>
  ): Promise<void> => {
    ctx.state.metricsRegister = register;
    await next();

    if (ctx.state.excludeFromMetrics) {
      return;
    }

    httpRequestCount.inc({ method: ctx.method, code: ctx.status });

    if (ctx.state.responseTime !== undefined) {
      httpRequestDurationSeconds.observe(
        {
          code: String(ctx.status),
          path: ctx.path,
        },
        ctx.state.responseTime / 1000
      );
    }
  };
};
