import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import compose from "koa-compose";
import { router as thingsRouter } from "./things/router";

export interface ApiRoutesOptions {
  prefix?: string;
}

export const apiRoutes = ({ prefix }: ApiRoutesOptions) => {
  const apiRouter = new Router<DefaultState, Context>({ prefix });

  apiRouter.use(
    "/things",
    thingsRouter.routes(),
    thingsRouter.allowedMethods()
  );

  return compose([apiRouter.routes(), apiRouter.allowedMethods()]);
};
