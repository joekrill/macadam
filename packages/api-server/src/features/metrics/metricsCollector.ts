import { metrics } from "@opentelemetry/api";
import { Middleware } from "koa";

const meter = metrics.getMeter("api-server");

const httpRequestCount = meter.createCounter("http_requests_total", {
  description: "Number of HTTP requests",
});

const httpRequestDurationSeconds = meter.createHistogram(
  "http_request_duration_seconds",
  {
    description: "Duration of HTTP requests in seconds",
  },
);

export const metricsCollector = (): Middleware => {
  return async (ctx, next): Promise<void> => {
    await next();

    if (ctx.state.excludeFromMetrics === true) {
      return;
    }

    httpRequestCount.add(1, { method: ctx.method, code: ctx.status });

    if (ctx.state.responseTime !== undefined) {
      httpRequestDurationSeconds.record(ctx.state.responseTime / 1000, {
        code: String(ctx.status),
        path: ctx._matchedRoute,
      });
    }
  };
};
