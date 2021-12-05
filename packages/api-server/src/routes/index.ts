import Router from "@koa/router";
import compose from "koa-compose";
import { ZodError } from "zod";
import { v1Router } from "./v1/v1Router";

export interface ApiRoutesOptions {
  prefix?: string;
}

export const apiRoutes = ({ prefix }: ApiRoutesOptions) => {
  const apiRouter = new Router({
    prefix: `${prefix}`,
  });

  apiRouter.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        ctx.status = 400;
        ctx.body = {
          error: {
            ...error,
            name: "ValidationError",
          },
        };

        if (ctx.app.env === "development") {
          ctx.body.error.stack = error.stack;
        }

        return;
      }

      throw error;
    }
  });

  apiRouter.use("/v1", v1Router.routes(), v1Router.allowedMethods());

  return compose([apiRouter.routes(), apiRouter.allowedMethods()]);
};
