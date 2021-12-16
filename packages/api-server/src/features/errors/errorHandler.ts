import { STATUS_CODES } from "http";
import { isHttpError } from "http-errors";
import { Middleware } from "koa";
import { ZodError } from "zod";

export const errorHandler =
  (): Middleware =>
  async (ctx, next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Validation errors should be reported as 400 errors
        ctx.status = 400;
        ctx.body = {
          error: {
            name: "ValidationError",
            statusCode: 400,

            // The default message just `JSON.stringify`'s the `issues`
            // propertyu which isn't helpful
            // message: error.message,
            message: "Validation failed",

            issues: error.issues,
          },
        };

        return;
      }

      if (isHttpError(error)) {
        const { expose, headers, name, message, status, statusCode, ...body } =
          error;
        if (headers) {
          ctx.set(headers);
        }

        ctx.status = statusCode || status || 500;
        ctx.body = {
          error: {
            name,
            statusCode: ctx.status,
            message: expose ? message : STATUS_CODES[ctx.status],
            ...body,
          },
        };

        if (ctx.status < 500) {
          // Non-server errors should not be treated as actual errors. But
          // anything greater than or equal to 500 should fall-through and
          // cause an error to be logged.
          return;
        }
      }

      // Anything else we weren't expected should be treated as a server error
      // and logged.
      ctx.app.emit("error", error, ctx);
    }
  };
