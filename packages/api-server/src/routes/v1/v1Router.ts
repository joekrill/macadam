import Router from "@koa/router";
import { devRouter } from "./dev/devRouter";
import { monitorRouter } from "./monitor/monitorRouter";
import { thingsRouter } from "./things/thingsRouter";

export const v1Router = new Router();

v1Router
  .use("/dev", devRouter.routes(), devRouter.allowedMethods())
  .use("/monitor", monitorRouter.routes(), monitorRouter.allowedMethods())
  .use("/things", thingsRouter.routes(), thingsRouter.allowedMethods());
