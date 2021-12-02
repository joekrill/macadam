import * as Sentry from "@sentry/node";
import Koa from "koa";

export interface InitializeSentryOptions extends Sentry.NodeOptions {
  dsn: string;
}

/**
 * Adds sentry error capturing when an app error occurs.
 */
export const initializeSentry = (
  app: Koa,
  options: InitializeSentryOptions
) => {
  Sentry.init({
    environment: app.env,
    ...options,
  });

  app.on("error", (err, ctx) => {
    Sentry.withScope(function (scope) {
      scope.addEventProcessor(function (event) {
        return Sentry.Handlers.parseRequest(event, ctx.request);
      });
      Sentry.captureException(err);
    });
  });

  app.context.addShutdownListener(async () => {
    app.context.logger.debug("Sentry connection closing...");
    // See: https://docs.sentry.io/platforms/node/guides/koa/configuration/draining/
    await Sentry.close();
    app.context.logger.debug("Sentry connection closed");
  });
};
