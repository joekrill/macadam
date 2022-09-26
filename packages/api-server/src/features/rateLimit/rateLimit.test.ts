import { createMockContext } from "@shopify/jest-koa-mocks";
import IORedis from "ioredis";
import { Middleware, ParameterizedContext } from "koa";
import {
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes,
} from "rate-limiter-flexible";
import { rateLimit } from "./rateLimit";

jest.unmock("./rateLimit");

const RateLimiterMemoryMock = RateLimiterMemory as jest.Mock<RateLimiterMemory>;
const RateLimiterRedisMock = RateLimiterRedis as jest.Mock<RateLimiterRedis>;

describe("rateLimit", () => {
  let instance: Middleware;
  const nextMock = jest.fn();
  const contextSetMock = jest.fn();
  let contextMock: ParameterizedContext;

  beforeEach(() => {
    RateLimiterMemoryMock.mockReset();
    RateLimiterRedisMock.mockReset();
  });

  describe("initialization", () => {
    describe("when a redis instance is available", () => {
      beforeEach(async () => {
        const redisMock = jest.fn<IORedis, any>(() => new IORedis());
        contextMock = createMockContext({
          customProperties: { redis: redisMock },
        });
        contextMock.set = contextSetMock;
        instance = rateLimit();
        await instance(contextMock, nextMock);
      });

      it("Uses RateLimiterRedis", () => {
        expect(RateLimiterMemoryMock).not.toHaveBeenCalled();
        expect(RateLimiterRedisMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("when a redis instance is not available", () => {
      beforeEach(async () => {
        contextMock = createMockContext();
        contextMock.set = contextSetMock;
        instance = rateLimit();
        await instance(contextMock, nextMock);
      });
      it("Uses RateLimiterMemory", () => {
        expect(RateLimiterMemoryMock).toHaveBeenCalledTimes(1);
        expect(RateLimiterRedisMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("middleware", () => {
    beforeEach(() => {
      contextMock = createMockContext();
      contextMock.set = contextSetMock;
    });

    let consumeMock: jest.Mock<Promise<RateLimiterRes>, any>;
    const rateLimiterPoints = 100;

    beforeEach(() => {
      consumeMock = jest.fn();
      RateLimiterMemoryMock.mockImplementation(
        () =>
          ({
            consume: consumeMock,
            points: rateLimiterPoints,
          } as unknown as RateLimiterMemory)
      );
      instance = rateLimit();
    });

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
        consumeMock.mockImplementation(() => {
          const res = new RateLimiterRes(
            remainingPoints,
            msBeforeNext,
            consumedPoints,
            isFirstInDuration
          );
          // @ts-ignore
          (res as RateLimiterRes).consumedPoints = 10000;
          // @ts-ignore
          (res as RateLimiterRes).isFirstInDuration = isFirstInDuration;
          // @ts-ignore
          (res as RateLimiterRes).msBeforeNext = msBeforeNext;
          // @ts-ignore
          (res as RateLimiterRes).remainingPoints = remainingPoints;
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
          String(rateLimiterPoints)
        );
        expect(contextSetMock).toHaveBeenCalledWith(
          "RateLimit-Remaining",
          String(remainingPoints)
        );
        expect(contextSetMock).toHaveBeenCalledWith(
          "RateLimit-Reset",
          String(msBeforeNext / 1000)
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
