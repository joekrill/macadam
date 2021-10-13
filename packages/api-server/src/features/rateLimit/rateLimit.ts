import { ensure as ensureError } from "errorish";
import IORedis from "ioredis";
import { Middleware } from "koa";
import {
  IRateLimiterOptions,
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes,
} from "rate-limiter-flexible";

export interface RateLimitOptions extends IRateLimiterOptions {
  redis?: IORedis.Redis;
}

/**
 * Returns Middleware which adds rate limiting to API requests.
 */

export const rateLimit = ({
  redis,
  ...options
}: RateLimitOptions = {}): Middleware => {
  const mergedOptions = {
    keyPrefix: "api-server",
    points: 10, // requests per ctx.ip
    duration: 1, // per 1 second
    ...options,
  };

  const rateLimiter = redis
    ? new RateLimiterRedis({ storeClient: redis, ...mergedOptions })
    : new RateLimiterMemory(mergedOptions);

  return async (ctx, next: () => Promise<void>): Promise<void> => {
    try {
      await rateLimiter.consume(ctx.ip);
    } catch (rateLimiterRes) {
      if (!(rateLimiterRes instanceof RateLimiterRes)) {
        return ctx.throw(ensureError(rateLimiterRes));
      }

      const reset = new Date(Date.now() + rateLimiterRes.msBeforeNext);
      const retryAfter = rateLimiterRes.msBeforeNext / 1000;
      ctx.set("Retry-After", String(retryAfter));
      ctx.set("RateLimit-Limit", String(rateLimiter.points));
      ctx.set("RateLimit-Remaining", String(rateLimiterRes.remainingPoints));
      ctx.set("RateLimit-Reset", reset.toISOString());
      ctx.status = 429;
      ctx.body = {
        status: "Too Many Requests",
        retryAfter,
      };

      return;
    }

    await next();
  };
};
