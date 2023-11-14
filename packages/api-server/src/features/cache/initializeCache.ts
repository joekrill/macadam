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
  const logger = app.context.logger.child({ module: "cache" });
  if (app.context.redis) {
    logger.info("Cache initialized: Redis");
    app.context.cache = new RedisCache(app.context.redis);
  } else if (app.env === "test") {
    logger.info("Cache initialized: None");
    app.context.cache = new DataCache();
  } else {
    logger.info("Cache initialized: Memory");
    app.context.cache = new MemoryCache();
  }
};
