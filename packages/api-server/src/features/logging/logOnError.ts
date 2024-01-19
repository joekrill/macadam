import { ensure as ensureError } from "errorish";
import { Context } from "koa";
import pino from "pino";

export const logOnError =
  (logger: pino.Logger) => (err: Error, ctx?: Context) => {
    const error = ensureError(err);

    if (ctx?.state) {
      ctx.state.logger.error(
        {
          stack: error.stack,
          type: error.name,
          state: ctx.state,
        },
        error.message,
      );
      return;
    }

    logger.error(
      {
        ...error,
        stack: error.stack,
      },
      error.message,
    );
  };
