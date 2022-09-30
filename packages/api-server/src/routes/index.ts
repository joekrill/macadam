import Router from "@koa/router";
import compose from "koa-compose";
import { healthRouter } from "./healthRouter";
import { v1Router } from "./v1/v1Router";

export interface ApiRoutesOptions {
  prefix?: string;
}

export const apiRoutes = ({ prefix }: ApiRoutesOptions) => {
  const apiRouter = new Router({
    prefix: `${prefix}`,
  });

  apiRouter.use(
    "/health",
    healthRouter.routes(),
    healthRouter.allowedMethods()
  );

  apiRouter.use("/v1", v1Router.routes(), v1Router.allowedMethods());

  return compose([apiRouter.routes(), apiRouter.allowedMethods()]);
};
