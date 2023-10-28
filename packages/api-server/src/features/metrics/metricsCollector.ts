import { Middleware } from "koa";
import { Counter, Histogram, Registry } from "prom-client";

export const metricsCollector = (registry: Registry): Middleware => {
  const httpRequestCount = new Counter({
    name: "http_requests_total",
    help: "Number of HTTP requests",
    labelNames: ["method", "code"],
    registers: [registry],
  });

  const httpRequestDurationSeconds = new Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["code", "path"],
    buckets: [0.01, 0.1, 0.25, 0.5, 1, 1.5, 5, 10],
    registers: [registry],
  });

  return async (ctx, next): Promise<void> => {
    await next();

    if (ctx.state.excludeFromMetrics === true) {
      return;
    }

    httpRequestCount.inc({ method: ctx.method, code: ctx.status });

    if (ctx.state.responseTime !== undefined) {
      httpRequestDurationSeconds.observe(
        {
          code: String(ctx.status),
          path: ctx.path,
        },
        ctx.state.responseTime / 1000,
      );
    }
  };
};
