import {
  Dedupe,
  ExtraErrorData,
  Offline,
  ReportingObserver,
} from "@sentry/integrations";
import { init, reactRouterV5Instrumentation } from "@sentry/react";
import { Integrations as TracingIntegrations } from "@sentry/tracing";
import { history } from "../routing/history";

const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === "development";

init({
  debug: process.env.NODE_ENV === "development",

  dsn: process.env.REACT_APP_SENTRY_DSN,

  environment: process.env.NODE_ENV,

  release: `${process.env.REACT_APP_NAME}@${process.env.REACT_APP_VERSION}${
    IS_DEVELOPMENT_ENV ? ".dev" : ""
  }`,

  integrations: [
    new TracingIntegrations.BrowserTracing({
      routingInstrumentation: reactRouterV5Instrumentation(history),
    }),

    // Extracts all non-native attributes from the Error object and attaches
    // them to the event as the extra data.
    new ExtraErrorData(),

    //  deduplicates certain events;
    new Dedupe(),

    // attempts to save events to the web browser's client-side storage when
    // the browser reports being offline, then automatically uploads events when
    // network connectivity is restored.
    new Offline(),

    // hooks into the ReportingObserver API and sends captured events
    new ReportingObserver(),
  ],

  tracesSampleRate: IS_DEVELOPMENT_ENV ? 1.0 : 0.2,
});
