import { Middleware, ParameterizedContext } from "koa";
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  register,
} from "prom-client";

export const metricsResults =
  ({ path }: { path: string }): Middleware =>
  (ctx, next) => {
    if (ctx.path === path) {
      ctx.headers["content-type"] = register.contentType;
      ctx.body = register.metrics();
    } else {
      return next();
    }
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
  };
};
