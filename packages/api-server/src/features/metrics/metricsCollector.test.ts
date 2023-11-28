import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { Middleware, Next, ParameterizedContext } from "koa";

const httpRequestCountMock = jest.fn();
const httpRequestDurationSecondsMock = jest.fn();

const createCounterMock = jest
  .fn()
  .mockReturnValue({ add: httpRequestCountMock });
const createHistogramMock = jest
  .fn()
  .mockReturnValue({ record: httpRequestDurationSecondsMock });

const getMeterMock = jest.fn().mockImplementation(() => ({
  createCounter: createCounterMock,
  createHistogram: createHistogramMock,
}));

jest.unstable_mockModule("@opentelemetry/api", () => ({
  metrics: {
    getMeter: getMeterMock,
  },
}));

describe("metricsCollector", () => {
  let createMetricsCollector: () => Middleware;
  let instance: Middleware;
  const nextMock = jest.fn<Next>();

  beforeAll(async () => {
    const metricsCollectorModule = await import("./metricsCollector.js");
    createMetricsCollector = () => metricsCollectorModule.metricsCollector();
  });

  beforeEach(() => {
    httpRequestCountMock.mockReset();
    httpRequestDurationSecondsMock.mockReset();
  });

  describe("middleware", () => {
    let contextMock: ParameterizedContext;

    describe("when `excludeFromMetrics` is false", () => {
      beforeEach(() => {
        contextMock = {
          state: { excludeFromMetrics: false },
        } as unknown as ParameterizedContext;
        instance = createMetricsCollector();
      });

      it("increments the request counter", async () => {
        await instance(contextMock, nextMock);
        expect(httpRequestCountMock).toHaveBeenCalledTimes(1);
      });

      describe("when `state.responseTime` is undefined", () => {
        beforeEach(() => {
          contextMock.state.responseTime = undefined;
        });

        it("observes the request duration", async () => {
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsMock).not.toHaveBeenCalled();
        });
      });

      describe("when `state.responseTime` has a value", () => {
        beforeEach(() => {
          contextMock.state.responseTime = 300;
        });

        it("observes the request duration", async () => {
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsMock).toHaveBeenCalledTimes(1);
        });
      });

      describe("when `state.responseTime` is 0", () => {
        beforeEach(() => {
          contextMock.state.responseTime = 0;
        });

        it("observes the request duration", async () => {
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsMock).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("when `excludeFromMetrics` is true", () => {
      beforeEach(() => {
        contextMock.state.excludeFromMetrics = true;
        contextMock.state.responseTime = 3000;
      });

      it("does not increment the request counter", async () => {
        await instance(contextMock, nextMock);
        expect(httpRequestCountMock).not.toHaveBeenCalled();
      });

      it("does not observe the request duration", async () => {
        await instance(contextMock, nextMock);
        expect(httpRequestDurationSecondsMock).not.toHaveBeenCalled();
      });
    });
  });
});
