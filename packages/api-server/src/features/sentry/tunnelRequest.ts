import fetch from "cross-fetch";
import { ensure as ensureError } from "errorish";
import { Middleware } from "koa";
import { z } from "zod";

const headerValidator = z.object({ dsn: z.string().optional() });

type Header = z.infer<typeof headerValidator>;

/**
 * Middleware which tunnels Sentry requests
 *
 * DSNs must be whitelisted when configuring sentry, using the `tunnelableDsns`
 * option. This is an array of DSNs that can be tunnled to. Each DSN may also
 * be optionally mapped to an alternate destination.
 *
 * @see {@url https://docs.sentry.io/platforms/javascript/troubleshooting/#using-the-tunnel-option}
 */
export const tunnelRequest: Middleware = async (ctx, next) => {
  const tunnelableDsns = ctx.sentry?.tunnelableDsns;
  const { logger } = ctx.state;

  if (!tunnelableDsns || tunnelableDsns.length === 0) {
    logger.debug({}, "Sentry tunnel requested but tunnelableDsns is empty!");
    return next();
  }

  const payload = ctx.request.body;

  if (typeof payload !== "string") {
    logger.debug(
      { payload, type: typeof payload },
      "Sentry tunnel requested with unexpected payload (expecting a string)"
    );
    return next();
  }

  // Sentry sends a payload which is 3 JSON object delimited by a new line
  // character. We only need the first, which is considered the "header" and
  // contains the destination dsn.
  const [rawHeader] = payload.split("\n");

  if (!rawHeader) {
    logger.debug({ payload }, "Sentry tunnel requested with empty body");
    return ctx.throw(400, "Invalid payload");
  }

  let header: Header;

  try {
    header = headerValidator.parse(JSON.parse(rawHeader));
  } catch (err) {
    logger.debug({ rawHeader }, "Sentry tunnel requested with unknown header");
    return ctx.throw(400, ensureError(err), { expose: true });
  }

  if (!header.dsn) {
    logger.debug({ header }, "Sentry tunnel requested with no DSN in header");
    return ctx.throw(400, "DSN missing", { expose: true });
  }

  if (!tunnelableDsns.includes(header.dsn)) {
    logger.debug(
      { dsn: header.dsn },
      "Sentry tunnel requested with forbidden DSN"
    );
    return ctx.throw(400, "DSN forbidden", { dsn: header.dsn, expose: true });
  }

  let dsnUrl: URL;

  try {
    dsnUrl = new URL(header.dsn);
  } catch (err) {
    return ctx.throw(400, "DSN invalid", { dsn: header.dsn, expose: true });
  }

  // The DSN URL will be in the form "https://<host>/<project_id>
  // So we extract the project ID from that, and replace it with
  // "/api/<project_id>/envelope/" to get the final destination URL.
  const [projectId] = dsnUrl.pathname.split("/").filter((p) => p);
  dsnUrl.pathname = ["api", projectId, "envelope", ""].join("/");

  if (dsnUrl.username) {
    dsnUrl.searchParams.set("sentry_key", dsnUrl.username);
    dsnUrl.username = "";
  }

  const response = await fetch(dsnUrl.toString(), {
    method: "POST",
    body: payload,
  });

  // Pass-through status, body, and headers.
  ctx.status = response.status;
  ctx.body = response.body;
  response.headers.forEach((value, header) => {
    if (value) {
      ctx.set(header, value);
    }
  });
};
