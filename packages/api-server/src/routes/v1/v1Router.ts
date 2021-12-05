import Router from "@koa/router";
import { thingsRouter } from "./things/thingsRouter";

export const v1Router = new Router();

v1Router.use("/things", thingsRouter.routes(), thingsRouter.allowedMethods());
