import * as Sentry from "@sentry/node";
import Koa, { DefaultContext, DefaultState, ParameterizedContext } from "koa";

const TUNNEL_MAP_DELIMITER = "::";

export interface SentryContext {
  sentry?: {
    tunnelableDsns: Record<string, string>;
  };
}

export interface InitializeSentryOptions extends Sentry.NodeOptions {
  dsn: string;

  /**
   * A list of DSNs that we allow to be tunneled through the API server.
   * Each entry may optionally map to a different DSN internally. For example:
   * `https://example.com/1::http://localhost/4` would allow incoming requests
   * that specify a `dsn` of "https://example.com/1", but would tunnel them
   * to "http://localhost/4" instead.
   */
  tunnelableDsns?: string[];
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

  Object.defineProperty(app.context, "sentry", {
    value: {
      dsn: options.dsn,
      tunnelableDsns: options.tunnelableDsns?.reduce((map, dsn) => {
        const [source, dest] = dsn.split(TUNNEL_MAP_DELIMITER);
        return { ...map, [source || dsn]: dest || source || dsn };
      }, {}),
    },
  });

  app.on(
    "error",
    (err, ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
      Sentry.withScope((scope) => {
        scope.addEventProcessor((event) => {
          // For the *most* part `parseRequest` can add many event details,
          // but it's actually built with `express` in mind, not Koa, so
          // we can use it, but we need to augment it with some addtional data
          // that it can't extract (ip address, user)
          Sentry.Handlers.parseRequest(event, ctx.request, {
            user: false,
            ip: false,
          });

          if (ctx.ip) {
            event.user = {
              ...event.user,
              ip_address: ctx.ip,
            };
          }

          const session = ctx.state._session;
          if (session) {
            event.user = {
              ...event.user,
              id: session.identity.id,
              email: session.identity.verifiable_addresses?.[0]?.value,
            };
          }

          return event;
        });

        Sentry.captureException(err);
      });
    }
  );

  app.context.addShutdownListener(async () => {
    app.context.logger.debug("Sentry connection closing...");
    // See: https://docs.sentry.io/platforms/node/guides/koa/configuration/draining/
    await Sentry.close();
    app.context.logger.debug("Sentry connection closed");
  });
};
