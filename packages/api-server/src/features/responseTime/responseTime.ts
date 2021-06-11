import { Context, Middleware } from "koa";

const NANOSECONDS_PER_MILLISECOND = 1000000;
const MILLISECOND_PER_SECOND = 1000;

export interface ResponseTimeState {
  responseTime: number;
}

/**
 * Returns Middleware which adds a `responseTime` property to the state
 * and adds a `Response-Time` header including the value. The value is
 * in milliseconds.
 */

export const responseTime = (): Middleware<ResponseTimeState> => {
  return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    const start = process.hrtime();
    try {
      await next();
    } finally {
      const [seconds, nanoseconds] = process.hrtime(start);
      const milliseconds =
        seconds * MILLISECOND_PER_SECOND +
        nanoseconds / NANOSECONDS_PER_MILLISECOND;
      ctx.state.responseTime = milliseconds;
      ctx.set("Response-Time", `${Math.round(ctx.state.responseTime)}ms`);
    }
  };
};
