import Router from "@koa/router";
import { STATUS_CODES } from "http";
import createHttpError from "http-errors";
import { DefaultContext, DefaultState } from "koa";

/**
 * The devRouter provides various routes for use only during development/testing
 * and are not exposed in other environments.
 */
export const devRouter = new Router<DefaultState, DefaultContext>();

devRouter
  .use((ctx, next) => {
    if (ctx.app.env !== "development" && ctx.app.env !== "test") {
      return ctx.throw(404);
    }

    return next();
  })
  .all("/status/:code(\\d+)/:message?", (ctx, next) => {
    const { code, message } = ctx.params;
    const codeValue = parseInt(code!, 10);

    if (codeValue < 600 && codeValue >= 400) {
      const error = message
        ? createHttpError(codeValue, message)
        : createHttpError(codeValue);
      throw error;
    }

    if (codeValue < 400 && codeValue >= 200) {
      ctx.status = codeValue;
      ctx.body = { message: message || STATUS_CODES[codeValue] };
      return;
    }

    return next();
  });
