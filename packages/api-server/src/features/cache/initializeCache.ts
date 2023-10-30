import Koa from "koa";
import { DataCache } from "./DataCache.js";
import { MemoryCache } from "./MemoryCache.js";
import { RedisCache } from "./RedisCache.js";

export interface CacheContext {
  cache: DataCache;
}

/**
 * Initializes a data cache instance.
 */
export const initializeCache = async (app: Koa) => {
  if (app.context.redis) {
    app.context.logger.debug(`Cache initialized: Redis`);
    app.context.cache = new RedisCache(app.context.redis);
  } else if (app.env === "test") {
    app.context.logger.debug(`Cache initialized: None`);
    app.context.cache = new DataCache();
  } else {
    app.context.logger.debug(`Cache initialized: Memory`);
    app.context.cache = new MemoryCache();
  }
};
