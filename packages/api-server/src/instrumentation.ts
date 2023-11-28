import { diag, metrics } from "@opentelemetry/api";
import {
  getNodeAutoInstrumentations,
  getResourceDetectors,
} from "@opentelemetry/auto-instrumentations-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import setupNodeMetrics from "opentelemetry-node-metrics";

export const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "macadam-api",
    [SemanticResourceAttributes.SERVICE_VERSION]:
      process.env.npm_package_version,
  }),
  metricReader: new PrometheusExporter(),
  instrumentations: getNodeAutoInstrumentations(),
  resourceDetectors: getResourceDetectors(),
  traceExporter: new OTLPTraceExporter(),
});

sdk.start();
diag.info("OpenTelemetry automatic instrumentation started successfully");
setupNodeMetrics(metrics.getMeterProvider());

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => diag.info("OpenTelemetry SDK terminated"))
    .catch((error) => diag.error("Error terminating OpenTelemetry SDK", error));
});
