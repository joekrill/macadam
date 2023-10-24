import Router from "@koa/router";
import { contactUsRouter } from "./contact-us/contactUsRouter.js";
import { devRouter } from "./dev/devRouter.js";
import { monitorRouter } from "./monitor/monitorRouter.js";
import { sessionsRouter } from "./sessions/sessionsRouter.js";
import { thingsRouter } from "./things/thingsRouter.js";
import { userRouter } from "./user/userRouter.js";
import { usersRouter } from "./users/usersRouter.js";

export const v1Router = new Router();

v1Router
  .use(
    "/contact-us",
    contactUsRouter.routes(),
    contactUsRouter.allowedMethods(),
  )
  .use("/dev", devRouter.routes(), devRouter.allowedMethods())
  .use("/monitor", monitorRouter.routes(), monitorRouter.allowedMethods())
  .use("/sessions", sessionsRouter.routes(), sessionsRouter.allowedMethods())
  .use("/things", thingsRouter.routes(), thingsRouter.allowedMethods())
  .use("/users", usersRouter.routes(), usersRouter.allowedMethods())
  .use("/user", userRouter.routes(), userRouter.allowedMethods());
