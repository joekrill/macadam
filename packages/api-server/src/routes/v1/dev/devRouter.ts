import Router from "@koa/router";
import createHttpError from "http-errors";
import { DefaultContext, DefaultState } from "koa";

export const devRouter = new Router<DefaultState, DefaultContext>();

devRouter
  .use((ctx, next) => {
    if (ctx.app.env !== "development" && ctx.app.env !== "test") {
      return ctx.throw(404);
    }

    return next();
  })
  .all("/status/:code(\\d+)/:message?", (ctx) => {
    const { code, message } = ctx.params;
    throw createHttpError(parseInt(code!), message!);
  });
