import Router from "@koa/router";

export const healthRouter = new Router();

healthRouter.get("/", (ctx) => {
  ctx.body = { server: "ok" };
  ctx.status = 200;
});
