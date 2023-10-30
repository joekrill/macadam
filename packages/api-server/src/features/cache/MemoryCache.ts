import { LRUCache } from "lru-cache";
import { ZodType } from "zod";
import {
  DataCache,
  DataCacheKey,
  dataCacheWrapperSchema,
} from "./DataCache.js";

/**
 * A cache implementation that stores data in memory.
 */
export class MemoryCache extends DataCache {
  readonly _cache: LRUCache<string, object>;

  constructor() {
    super();
    this._cache = new LRUCache<string, object>({
      max: 100,
    });
  }

  async set(cacheKey: DataCacheKey, value: unknown, expires: Date) {
    this._cache.set(
      this.stringifyKey(cacheKey),
      {
        expires: new Date(expires.getTime()),
        value,
      },
      {
        ttl: expires.getTime() - Date.now(),
      },
    );
    return true;
  }

  async get<T extends ZodType>(
    cacheKey: DataCacheKey,
    validator?: T,
  ): Promise<{ value: T["_output"]; expires: Date } | undefined> {
    const key = this.stringifyKey(cacheKey);
    const result = this._cache.get(key);

    if (!result) {
      return undefined;
    }

    try {
      const { value, expires } = dataCacheWrapperSchema.parse(result);
      if (expires.getTime() < Date.now()) {
        this._cache.delete(key);
        return undefined;
      }

      return {
        expires,
        value: validator ? await validator.parseAsync(value) : value,
      };
    } catch (err) {
      this._cache.delete(key);
      return undefined;
    }
  }
}
