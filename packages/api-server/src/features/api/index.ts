import Router from "@koa/router";
import compose from "koa-compose";
import { router as thingsRouter } from "./things/router";

export interface ApiRoutesOptions {
  prefix?: string;
}

export const apiRoutes = ({ prefix }: ApiRoutesOptions) => {
  const apiRouter = new Router({ prefix });

  apiRouter.use(
    "/things",
    thingsRouter.routes(),
    thingsRouter.allowedMethods()
  );
  // apiRouter.use();

  return compose([apiRouter.routes(), apiRouter.allowedMethods()]);
};
