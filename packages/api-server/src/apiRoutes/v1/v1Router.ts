import Router from "@koa/router";
import { thingsRouter } from "./things/thingsRouter";
import { userPreferencesRouter } from "./userPreferences/userPreferencesRouter";

export const v1Router = new Router();

v1Router
  .use("/things", thingsRouter.routes(), thingsRouter.allowedMethods())
  .use(
    "/user-preferences",
    userPreferencesRouter.routes(),
    userPreferencesRouter.allowedMethods()
  );
