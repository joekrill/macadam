import {
  ExtraErrorData,
  Offline,
  ReportingObserver,
} from "@sentry/integrations";
import * as Sentry from "@sentry/react";
import { defaultIntegrations, init } from "@sentry/react";
import { Integrations as TracingIntegrations } from "@sentry/tracing";
import { useEffect } from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === "development";

const { origin, hostname } = window.location;
if (process.env.NODE_ENV !== "test") {
  init({
    debug: false,

    dsn: process.env.VITE_SENTRY_DSN,

    tunnel: process.env.VITE_SENTRY_TUNNEL,

    environment: process.env.NODE_ENV,

    release: `${process.env.VITE_NAME}@${process.env.VITE_VERSION}${
      IS_DEVELOPMENT_ENV ? ".dev" : ""
    }`,

    integrations: [
      ...defaultIntegrations,

      new TracingIntegrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
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
}
