import stringifyDeterministic from "json-stringify-deterministic";
import { ZodType, z } from "zod";

export type DataCacheKey = unknown[] | string;

export const dataCacheWrapperSchema = z.object({
  expires: z.coerce.date(),
  value: z.unknown(),
});

export type DataCacheWrapper = z.infer<typeof dataCacheWrapperSchema>;

export type CachedData<T extends ZodType> = {
  value: T["_output"];
  expires: Date;
};

/**
 * A base cache "implementation" that doesn't actually do any caching.
 */
export class DataCache {
  stringifyKey(key: DataCacheKey, delimiter = ":") {
    if (typeof key === "string") {
      return key;
    }

    return key
      .map((v) => (typeof v === "string" ? v : stringifyDeterministic(v)))
      .join(delimiter);
  }

  async set(
    cacheKey: DataCacheKey,
    value: unknown,
    expires: Date,
  ): Promise<boolean> {
    return false;
  }

  async get<T extends ZodType>(
    cacheKey: DataCacheKey,
    parser?: T,
  ): Promise<{ value: T["_output"]; expires: Date } | undefined> {
    return undefined;
  }
}
