declare module "opentelemetry-node-metrics" {
  import { MeterProvider } from "@opentelemetry/api";

  export interface SetupNodeMetricsConfig {
    prefix?: string;
    labels?: Dict<string, unknown>;
  }

  export function setupNodeMetrics(
    meterProvider: MeterProvider,
    config?: SetupNodeMetricsConfig,
  );
  export = setupNodeMetrics;
}
