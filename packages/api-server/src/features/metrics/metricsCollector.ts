import { Middleware } from "koa";
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from "prom-client";

export interface MetricsCollectorState {
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

  return async (ctx, next): Promise<void> => {
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
