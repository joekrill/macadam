import { beforeEach, describe, expect, it } from "@jest/globals";
import { z } from "zod";
import { MemoryCache } from "./MemoryCache.js";

describe("MemoryCache", () => {
  let instance: MemoryCache;
  let expiresOneYear: Date;

  beforeEach(async () => {
    instance = new MemoryCache();
    expiresOneYear = new Date();
    expiresOneYear.setFullYear(expiresOneYear.getFullYear() + 1);
  });

  describe("set", () => {
    const value = { bar: "baz" };

    it("sets the value in the cache with an expiration time", async () => {
      const result = await instance.set("foo", value, expiresOneYear);
      expect(result).toBe(true);
      expect(instance._cache.has("foo")).toBe(true);
    });
  });

  describe("get", () => {
    describe("with an array key", () => {
      it("stringifies the key", async () => {
        await instance.set(["foo", "bar"], {}, expiresOneYear);
        expect(instance._cache.has("foo:bar")).toBe(true);
      });
    });

    describe("when value not found", () => {
      it("returns undefined", async () => {
        const result = await instance.get("foo");
        expect(result).toBeUndefined();
      });
    });

    describe("when an invalid value is found", () => {
      let result: unknown;
      beforeEach(async () => {
        instance._cache.set("foo", {});
        result = await instance.get("foo");
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });

      it("deletes the key", () => {
        expect(instance._cache.has("foo")).toBe(false);
      });
    });

    describe("when a valid value is found", () => {
      const data = { foo: "bar" };

      beforeEach(async () => {
        await instance.set("foo", data, expiresOneYear);
      });

      it("returns the parsed value", async () => {
        const result = await instance.get("foo");
        expect(result).toEqual({ value: data, expires: expiresOneYear });
      });
    });

    describe("when a validator is provided", () => {
      let result: unknown;

      describe("and the data passes validation", () => {
        beforeEach(async () => {
          await instance.set("foo", 123, expiresOneYear);
          result = await instance.get("foo", z.number());
        });

        it("returns the value", () => {
          expect(result).toEqual(
            expect.objectContaining({
              expires: expiresOneYear,
              value: 123,
            }),
          );
        });
      });

      describe("and the data fails validation", () => {
        beforeEach(async () => {
          await instance.set("foo", 123, expiresOneYear);
          result = await instance.get("foo", z.string());
        });

        it("returns undefined", () => {
          expect(result).toBeUndefined();
        });

        it("deletes the key", () => {
          expect(instance._cache.has("foo")).toBe(false);
        });
      });
    });
  });
});
