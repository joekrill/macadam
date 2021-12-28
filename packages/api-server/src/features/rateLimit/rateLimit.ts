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
 * Returns Middleware which adds rate limiting to requests.
 *
 * For documentation, @see {@url https://github.com/animir/node-rate-limiter-flexible/}
 * For header information, @see {@url https://tools.ietf.org/id/draft-polli-ratelimit-headers-00.html}
 */
export const rateLimit = ({
  redis,
  ...options
}: RateLimitOptions = {}): Middleware => {
  let rateLimiter: RateLimiterMemory | RateLimiterRedis | undefined = undefined;

  return async (ctx, next: () => Promise<void>): Promise<void> => {
    const mergedOptions = {
      keyPrefix: ctx.appName,
      points: 10, // requests per ctx.ip
      duration: 1, // per 1 second
      ...options,
    };

    if (!rateLimiter) {
      rateLimiter = ctx.redis
        ? new RateLimiterRedis({ storeClient: ctx.redis, ...mergedOptions })
        : new RateLimiterMemory(mergedOptions);
    }
    let rateLimiterRes: RateLimiterRes | undefined = undefined;

    try {
      rateLimiterRes = await rateLimiter.consume(ctx.ip);
      await next();
    } catch (error) {
      if (!(error instanceof RateLimiterRes)) {
        return ctx.throw(ensureError(error));
      }

      rateLimiterRes = error;

      const retryAfter = rateLimiterRes.msBeforeNext / 1000;
      ctx.set("Retry-After", String(retryAfter));
      ctx.status = 429;
      ctx.body = {
        status: "Too Many Requests",
        retryAfter,
      };
    } finally {
      if (rateLimiterRes) {
        ctx.set("RateLimit-Limit", String(rateLimiter.points));
        ctx.set("RateLimit-Remaining", String(rateLimiterRes.remainingPoints));
        ctx.set("RateLimit-Reset", String(rateLimiterRes.msBeforeNext / 1000));
      } else {
        ctx.set("Hello", "123");
      }
    }
  };
};
