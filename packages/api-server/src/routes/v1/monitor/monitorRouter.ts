import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";
import { tunnelRequest } from "../../../features/sentry/tunnelRequest";

export const monitorRouter = new Router<DefaultState, DefaultContext>();

monitorRouter.all("(.*)", tunnelRequest);
