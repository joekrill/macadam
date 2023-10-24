import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";
import { tunnelRequest } from "../../../features/sentry/tunnelRequest.js";

/**
 * The monitor router is used to tunnel sentry requests through our API
 * server (so they are not blocked by adblockers, etc)
 */
export const monitorRouter = new Router<DefaultState, DefaultContext>();

monitorRouter.all("(.*)", tunnelRequest);
