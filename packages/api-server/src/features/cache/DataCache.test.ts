import { beforeEach, describe, expect, it } from "@jest/globals";
import { DataCache } from "./DataCache.js";

describe("RedisCache", () => {
  let instance: DataCache;

  beforeEach(() => {
    instance = new DataCache();
  });

  describe("stringifyKey", () => {
    describe("when called with a string", () => {
      it("returns the string itself", () => {
        expect(instance.stringifyKey("foo")).toEqual("foo");
      });
    });

    describe("when called with an array of strings", () => {
      it("returns the strings concatenated with colons", () => {
        expect(instance.stringifyKey(["foo", "bar", "baz", "buz"])).toEqual(
          "foo:bar:baz:buz",
        );
      });
    });

    describe("when called with an object", () => {
      it("stringifies the object", () => {
        expect(instance.stringifyKey([{ a: "b" }])).toEqual('{"a":"b"}');
      });
    });

    describe("when called with a mix of strings an objects", () => {
      it("stringifies the objects, maintains the strings, and concatenates them with colons", () => {
        expect(instance.stringifyKey(["foo", { a: "b" }, "bar"])).toEqual(
          'foo:{"a":"b"}:bar',
        );
      });
    });
  });

  describe("set", () => {
    const value = { bar: "baz" };
    const expires = new Date();
    it("does not throw", async () => {
      expect(
        async () => await instance.set("foo", value, expires),
      ).not.toThrow();
    });

    it("returns false", async () => {
      const result = await instance.set("foo", value, expires);
      expect(result).toBe(false);
    });
  });

  describe("get", () => {
    it("returns undefined", async () => {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      await instance.set("foo", "bar", expires);
      const result = await instance.get("foo");
      expect(result).toBeUndefined();
    });
  });
});
