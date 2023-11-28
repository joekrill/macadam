import Koa from "koa";
import { metricsCollector } from "./metricsCollector.js";

export interface MetricsState {
  /**
   * When set to `true` (by some other middleware, for example), will cause
   * a given request to not be included in metric collection.
   */
  excludeFromMetrics?: boolean;
}

export const initializeMetrics = async (app: Koa) => {
  const logger = app.context.logger.child({ module: "metrics" });
  app.use(metricsCollector());
  logger.info("Metrics initialized");
};
