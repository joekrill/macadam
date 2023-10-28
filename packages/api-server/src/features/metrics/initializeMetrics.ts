import Koa from "koa";
import { Registry, collectDefaultMetrics } from "prom-client";
import { metricsCollector } from "./metricsCollector.js";

export interface MetricsContext {
  metrics: {
    registry: Registry;
  };
}

export interface MetricsState {
  /**
   * When set to `true` (by some other middleware, for example), will cause
   * a given request to not be included in metric collection.
   */
  excludeFromMetrics?: boolean;
}

export const initializeMetrics = async (app: Koa) => {
  const registry = new Registry();
  app.context.metrics = { registry };
  collectDefaultMetrics({ register: registry });
  app.use(metricsCollector(registry));
};
