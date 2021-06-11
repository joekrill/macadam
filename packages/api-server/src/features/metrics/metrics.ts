import Router from "@koa/router";
import { Middleware, ParameterizedContext } from "koa";
import compose from "koa-compose";
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  register,
} from "prom-client";

export interface MetricsRoutesOptions {
  path: string;
}

export const metricsRoutes = ({ path }: MetricsRoutesOptions) => {
  const router = new Router({ prefix: path });

  router.get("/", async (ctx) => {
    ctx.state.excludeFromMetrics = true;
    ctx.set("Content-Type", register.contentType);
    ctx.body = await register.metrics();
  });

  return compose([router.routes(), router.allowedMethods()]);
};

export const metricsCollector = (): Middleware => {
  collectDefaultMetrics();
  const httpRequestCount = new Counter({
    name: "http_requests_total",
    help: "Number of HTTP requests",
    labelNames: ["method", "code"],
  });

  const httpRequestDurationSeconds = new Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["code", "path"],
    buckets: [0.01, 0.1, 0.25, 0.5, 1, 1.5, 5, 10],
  });

  return async (
    ctx: ParameterizedContext,
    next: () => Promise<void>
  ): Promise<void> => {
    await next();

    if (ctx.state.excludeFromMetrics) {
      return;
    }

    httpRequestCount.inc({ method: ctx.method, code: ctx.status });
    httpRequestDurationSeconds.observe(
      {
        code: String(ctx.status),
        path: ctx.path,
      },
      ctx.state.responseTime / 1000
    );
    console.log("DONE");
  };
};
