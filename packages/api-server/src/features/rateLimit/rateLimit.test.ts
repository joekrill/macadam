import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type { Redis } from "ioredis";
import { Middleware, Next, ParameterizedContext } from "koa";
import type {
  RateLimiterAbstract,
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes,
} from "rate-limiter-flexible";

const consumeMock = jest.fn();
const rateLimiterMock = {
  block: jest.fn(),
  consume: consumeMock,
  delete: jest.fn(),
  get: jest.fn(),
  getKey: jest.fn(),
  parseKey: jest.fn(),
  penalty: jest.fn(),
  reward: jest.fn(),
  set: jest.fn(),
  points: 50,
  duration: 0,
  blockDuration: 0,
  msBlockDuration: 0,
  msDuration: 0,
  execEvenly: false,
  execEvenlyMinDelayMs: 0,
  keyPrefix: "",
} as RateLimiterAbstract;

const RateLimiterMemoryMock = jest.fn<() => RateLimiterMemory>();
const RateLimiterRedisMock = jest.fn<() => RateLimiterRedis>();
const RateLimiterResMock = jest.fn<(properties: any) => RateLimiterRes>(
  (properties) => ({
    consumedPoints: 1,
    isFirstInDuration: false,
    msBeforeNext: 100,
    remainingPoints: 1000,
    toJSON: jest.fn<() => any>(),
    toString: jest.fn<() => string>(),
    ...properties,
  }),
);

jest.unstable_mockModule("rate-limiter-flexible", () => ({
  RateLimiterMemory: RateLimiterMemoryMock,
  RateLimiterRedis: RateLimiterRedisMock,
  RateLimiterRes: RateLimiterResMock,
}));

const contextSetMock = jest.fn();
const contextThrowMock = jest.fn();

describe("rateLimit", () => {
  let rateLimit: () => Middleware;
  let instance: Middleware;
  const nextMock = jest.fn<Next>();
  let contextMock: ParameterizedContext;

  beforeAll(async () => {
    const rateLimitModule = await import("./rateLimit.js");
    rateLimit = rateLimitModule.rateLimit;
  });

  beforeEach(() => {
    RateLimiterMemoryMock.mockImplementation(() => rateLimiterMock);
    RateLimiterRedisMock.mockImplementation(
      () => rateLimiterMock as RateLimiterRedis,
    );
    instance = rateLimit();
    contextMock = {
      set: contextSetMock,
      throw: contextThrowMock,
    } as unknown as ParameterizedContext;
  });

  afterEach(() => {
    RateLimiterMemoryMock.mockReset();
    RateLimiterRedisMock.mockReset();
    RateLimiterResMock.mockReset();
    contextSetMock.mockReset();
    contextThrowMock.mockReset();
    consumeMock.mockReset();
  });

  describe("initialization", () => {
    describe("when a redis instance is available", () => {
      beforeEach(async () => {
        const redisMock = jest.fn(); //.mockImplementation(() => new IORedis());
        contextMock.redis = redisMock as unknown as Redis;
        await instance(contextMock, nextMock);
      });

      it("Uses RateLimiterRedis", () => {
        expect(RateLimiterRedisMock.mock.instances).toHaveLength(1);
        expect(RateLimiterMemoryMock.mock.instances).toHaveLength(0);
      });
    });

    describe("when a redis instance is not available", () => {
      beforeEach(async () => {
        await instance(contextMock, nextMock);
      });

      it("Uses RateLimiterMemory", () => {
        expect(RateLimiterRedisMock.mock.instances).toHaveLength(0);
        expect(RateLimiterMemoryMock.mock.instances).toHaveLength(1);
      });
    });

    describe("lazily instantiates the rate limiter", () => {
      it("does not instantiate initially", () => {
        expect(RateLimiterRedisMock.mock.instances).toHaveLength(0);
        expect(RateLimiterMemoryMock.mock.instances).toHaveLength(0);
      });

      it("does not instantiate multiple instances", async () => {
        await instance(contextMock, nextMock);
        await instance(contextMock, nextMock);
        await instance(contextMock, nextMock);
        expect(RateLimiterRedisMock.mock.instances).toHaveLength(0);
        expect(RateLimiterMemoryMock.mock.instances).toHaveLength(1);
        expect(consumeMock).toBeCalledTimes(3);
      });
    });
  });

  describe("middleware", () => {
    describe("when consume is successful", () => {
      beforeEach(async () => {
        await instance(contextMock, nextMock);
      });

      it("calls next", () => {
        expect(nextMock).toHaveBeenCalled();
      });
    });

    describe("when consume throws a RateLimiterRes", () => {
      const consumedPoints = 1;
      const isFirstInDuration = false;
      const msBeforeNext = 15000;
      const remainingPoints = 0;

      beforeEach(async () => {
        const { RateLimiterRes } = await import("rate-limiter-flexible");
        consumeMock.mockImplementation(() => {
          const res = new RateLimiterRes();
          // @ts-ignore
          res.consumedPoints = consumedPoints;
          // @ts-ignore
          res.isFirstInDuration = isFirstInDuration;
          // @ts-ignore
          res.msBeforeNext = msBeforeNext;
          // @ts-ignore
          res.remainingPoints = remainingPoints;
          return Promise.reject(res);
        });
        await instance(contextMock, nextMock);
      });

      it("returns a 429 status code", () => {
        expect(contextMock.status).toBe(429);
      });

      it("includes details in the response", () => {
        expect(contextMock.body).toMatchObject({
          status: "Too Many Requests",
          retryAfter: msBeforeNext / 1000,
        });
      });

      it("Sets RateLimit headers", () => {
        expect(contextSetMock).toHaveBeenCalledWith(
          "RateLimit-Limit",
          String(rateLimiterMock.points),
        );
        expect(contextSetMock).toHaveBeenCalledWith(
          "RateLimit-Remaining",
          String(remainingPoints),
        );
        expect(contextSetMock).toHaveBeenCalledWith(
          "RateLimit-Reset",
          String(msBeforeNext / 1000),
        );
      });
    });

    describe("when consume throws an error", () => {
      const error = new Error("unknown error");

      beforeEach(async () => {
        consumeMock.mockImplementation(() => Promise.reject(error));
        await instance(contextMock, nextMock);
      });

      it("throws the error to koa", () => {
        expect(contextMock.throw).toHaveBeenCalledWith(error);
      });
    });
  });
});
