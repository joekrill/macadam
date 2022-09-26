import * as Sentry from "@sentry/react";
import { Routes as ReactRouterRoutes } from "react-router-dom";

export const Routes = Sentry.withSentryReactRouterV6Routing(ReactRouterRoutes);
