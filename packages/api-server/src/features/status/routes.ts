import Router from "@koa/router";

export const router = new Router();

router.get("/", (ctx) => {
  ctx.status = 200;
  ctx.body = { status: "ok " };
});
