import IORedis from "ioredis";
import { ZodType } from "zod";
import {
  DataCache,
  DataCacheKey,
  dataCacheWrapperSchema,
} from "./DataCache.js";

export class RedisCache extends DataCache {
  constructor(private readonly redis: IORedis) {
    super();
  }

  async set(cacheKey: DataCacheKey, value: unknown, expires: Date) {
    const result = await this.redis.set(
      this.stringifyKey(cacheKey),
      JSON.stringify({ value, expires }),
      "PXAT",
      expires.getTime(),
    );

    return result === "OK";
  }

  async get<T extends ZodType>(
    cacheKey: DataCacheKey,
    validator?: T,
  ): Promise<{ value: T["_output"]; expires: Date } | undefined> {
    const key = this.stringifyKey(cacheKey);

    const cached = await this.redis.get(key);
    if (!cached) {
      return undefined;
    }

    try {
      const { expires, value } = dataCacheWrapperSchema.parse(
        JSON.parse(cached),
      );
      return {
        expires,
        value: validator ? await validator.parseAsync(value) : value,
      };
    } catch (err) {
      // TODO: log this?
      this.redis.del(key);
      return undefined;
    }
  }
}
