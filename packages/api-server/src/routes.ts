import Router from "@koa/router";
import { router as statusRouter } from "./features/status/routes";
import { router as thingsRouter } from "./features/things/routes";

export const router = new Router();

router.use("/v1/status", statusRouter.routes(), statusRouter.allowedMethods());
router.use("/v1/things", thingsRouter.routes(), thingsRouter.allowedMethods());
