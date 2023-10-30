import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import IORedis from "ioredis";
import { z } from "zod";
import { RedisCache } from "./RedisCache.js";

const redisSetMock = jest.fn();
const redisGetMock = jest.fn();
const redisDelMock = jest.fn();

describe("RedisCache", () => {
  let instance: RedisCache;

  beforeEach(() => {
    redisSetMock.mockReset();
    redisGetMock.mockReset();
    redisDelMock.mockReset();
    instance = new RedisCache({
      set: redisSetMock,
      get: redisGetMock,
      del: redisDelMock,
    } as unknown as IORedis);
  });

  describe("set", () => {
    const value = { bar: "baz" };
    const expires = new Date();
    it("sets the value in redis with an expiration time", async () => {
      await instance.set("foo", value, expires);
      expect(redisSetMock).toHaveBeenCalledWith(
        "foo",
        expect.anything(),
        "PXAT",
        expires.getTime(),
      );
    });

    it("stringifies the key", async () => {
      await instance.set(["foo", "bar"], {}, expires);
      expect(redisSetMock).toHaveBeenCalledWith(
        "foo:bar",
        expect.anything(),
        "PXAT",
        expires.getTime(),
      );
    });
  });

  describe("get", () => {
    describe("with an array key", () => {
      it("stringifies the key", async () => {
        await instance.get(["foo", "bar"]);
        expect(redisGetMock).toHaveBeenCalledWith("foo:bar");
      });
    });

    describe("when value not found", () => {
      beforeEach(() => {
        redisGetMock.mockReturnValue(undefined);
      });

      it("returns undefined", async () => {
        const result = await instance.get("foo");
        expect(result).toBeUndefined();
      });
    });

    describe("when an invalid value is found", () => {
      let result: unknown;
      beforeEach(async () => {
        redisGetMock.mockReturnValue('{ foo: "bar" }');
        result = await instance.get("foo");
      });

      it("returns undefined", async () => {
        expect(result).toBeUndefined();
      });

      it("deletes the key", async () => {
        expect(redisDelMock).toHaveBeenCalledWith("foo");
      });
    });

    describe("when a valid value is found", () => {
      const returnValue = { value: {}, expires: new Date() };
      let result: unknown;
      beforeEach(async () => {
        redisGetMock.mockReturnValue(JSON.stringify(returnValue));
        result = await instance.get("foo");
      });

      it("returns the parsed value", async () => {
        expect(result).toEqual(returnValue);
      });
    });

    describe("when a validator is provided", () => {
      let result: unknown;
      const expires = new Date();

      describe("and the data passes validation", () => {
        beforeEach(async () => {
          redisGetMock.mockReturnValue(
            JSON.stringify({ expires, value: "hello!" }),
          );
          result = await instance.get("foo", z.string());
        });

        it("returns the value", () => {
          expect(result).toEqual(
            expect.objectContaining({
              expires,
              value: "hello!",
            }),
          );
        });
      });

      describe("and the data fails validation", () => {
        beforeEach(async () => {
          redisGetMock.mockReturnValue('{ foo: "bar" }');
          result = await instance.get("foo", z.string());
        });

        it("returns undefined", async () => {
          expect(result).toBeUndefined();
        });

        it("deletes the key", async () => {
          expect(redisDelMock).toHaveBeenCalledWith("foo");
        });
      });
    });
  });
});
