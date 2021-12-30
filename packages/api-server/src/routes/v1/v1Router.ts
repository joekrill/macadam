import Router from "@koa/router";
import { contactUsRouter } from "./contact-us/contactUsRouter";
import { devRouter } from "./dev/devRouter";
import { monitorRouter } from "./monitor/monitorRouter";
import { thingsRouter } from "./things/thingsRouter";
import { usersRouter } from "./users/usersRouter";

export const v1Router = new Router();

v1Router
  .use(
    "/contact-us",
    contactUsRouter.routes(),
    contactUsRouter.allowedMethods()
  )
  .use("/dev", devRouter.routes(), devRouter.allowedMethods())
  .use("/monitor", monitorRouter.routes(), monitorRouter.allowedMethods())
  .use("/things", thingsRouter.routes(), thingsRouter.allowedMethods())
  .use("/users", usersRouter.routes(), usersRouter.allowedMethods());
