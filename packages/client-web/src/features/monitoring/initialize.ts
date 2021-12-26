import {
  ExtraErrorData,
  Offline,
  ReportingObserver,
} from "@sentry/integrations";
import { defaultIntegrations, init } from "@sentry/react";
import { Integrations as TracingIntegrations } from "@sentry/tracing";
import { history } from "../routing/history";
import { historyRoutingInstrumentation } from "./historyRoutingInstrumentation";

const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === "development";

const { origin, hostname } = window.location;

init({
  debug: false,

  dsn: process.env.REACT_APP_SENTRY_DSN,

  tunnel: process.env.REACT_APP_SENTRY_TUNNEL,

  environment: process.env.NODE_ENV,

  release: `${process.env.REACT_APP_NAME}@${process.env.REACT_APP_VERSION}${
    IS_DEVELOPMENT_ENV ? ".dev" : ""
  }`,

  integrations: [
    ...defaultIntegrations,

    new TracingIntegrations.BrowserTracing({
      routingInstrumentation: historyRoutingInstrumentation(history),
      tracingOrigins: [`${origin || hostname}/api/`],
    }),

    // Extracts all non-native attributes from the Error object and attaches
    // them to the event as the extra data.
    new ExtraErrorData(),

    // attempts to save events to the web browser's client-side storage when
    // the browser reports being offline, then automatically uploads events when
    // network connectivity is restored.
    new Offline(),

    // hooks into the ReportingObserver API and sends captured events
    new ReportingObserver(),
  ],

  tracesSampleRate: IS_DEVELOPMENT_ENV ? 1.0 : 0.2,
});
