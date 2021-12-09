import Router from "@koa/router";
import http from "http";
import { DefaultContext, DefaultState } from "koa";

export const devRouter = new Router<DefaultState, DefaultContext>();

devRouter
  .use((ctx, next) => {
    if (ctx.app.env !== "development" && ctx.app.env !== "test") {
      return ctx.throw(404);
    }

    return next();
  })
  .all("/status/:code", (ctx) => {
    const { code: codeString } = ctx.params;
    const codeInt =
      codeString !== undefined ? parseInt(codeString, 10) : undefined;

    if (codeInt! < 500 && codeInt! >= 200) {
      ctx.body =
        http.STATUS_CODES[codeInt!] ||
        http.STATUS_CODES[codeString!] ||
        codeString;
      ctx.status = codeInt!;
      return;
    }

    // Invalid status codes will cause problems elsewhere (i.e. with any
    // gateway)
    ctx.body =
      http.STATUS_CODES[codeInt!] ||
      http.STATUS_CODES[codeString!] ||
      codeString;
    ctx.status = 500;
  });
