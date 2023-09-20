import IORedis from "ioredis";
import Koa from "koa";

export interface RedisContext {
  redis?: IORedis;
}

export interface InitializeRedisOptions {
  url: string;
}

/**
 * Initializes a redis connection, adds it to the application context,
 * and adds a listener to shutdown gracefully.
 */
export const initializeRedis = async (
  app: Koa,
  { url }: InitializeRedisOptions,
) => {
  const redis = new IORedis(url);
  app.context.logger.debug("Redis connecting");
  await redis.connect();
  app.context.logger.debug("Redis connected");

  app.context.addShutdownListener(async () => {
    app.context.logger.debug("Redis connection closing");
    await redis.disconnect(false);
    app.context.logger.debug("Redis connection closed");
  });
};
