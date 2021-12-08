import Router from "@koa/router";
import { monitorRouter } from "./monitor/monitorRouter";
import { thingsRouter } from "./things/thingsRouter";

export const v1Router = new Router();

v1Router
  .use("/monitor", monitorRouter.routes(), monitorRouter.allowedMethods())
  .use("/things", thingsRouter.routes(), thingsRouter.allowedMethods());
