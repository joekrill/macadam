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
            message: error.message,
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
          // Non-server errors should not be treated as actual errors
          return;
        }
      }

      // Anything else we weren't expected should be treated as a server error
      // and logged.
      ctx.app.emit("error", error, ctx);
    }
  };
