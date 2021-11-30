import Router from "@koa/router";
import { Context, DefaultState } from "koa";
import compose from "koa-compose";
import { router as thingsRouter } from "./things/router";
import { router as userPreferencesRouter } from "./userPreferences/router";

export interface ApiRoutesOptions {
  prefix?: string;
}

export const apiRoutes = ({ prefix }: ApiRoutesOptions) => {
  const apiRouter = new Router<DefaultState, Context>({
    prefix: `${prefix}/v1`,
  });

  apiRouter.use(
    "/things",
    thingsRouter.routes(),
    thingsRouter.allowedMethods()
  );

  apiRouter.use(
    "/user-preferences",
    userPreferencesRouter.routes(),
    userPreferencesRouter.allowedMethods()
  );

  return compose([apiRouter.routes(), apiRouter.allowedMethods()]);
};
