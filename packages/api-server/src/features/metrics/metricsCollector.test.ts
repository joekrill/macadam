import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { Middleware, Next, ParameterizedContext } from "koa";
import type {
  Counter,
  CounterConfiguration,
  Histogram,
  HistogramConfiguration,
} from "prom-client";

const CounterMock = jest.fn<(c: CounterConfiguration<any>) => Counter>();
const HistogramMock = jest.fn<(c: HistogramConfiguration<any>) => Histogram>();
const RegistryMock = jest.fn();

jest.unstable_mockModule("prom-client", () => ({
  collectDefaultMetrics: jest.fn(),
  Counter: CounterMock,
  Histogram: HistogramMock,
  Registry: RegistryMock,
}));

describe("metricsCollector", () => {
  let metricsCollector: () => Middleware;
  let instance: Middleware;
  const nextMock = jest.fn<Next>();

  beforeAll(async () => {
    const metricsCollectorModule = await import("./metricsCollector.js");
    metricsCollector = metricsCollectorModule.metricsCollector;
  });

  describe("initialization", () => {
    beforeEach(async () => {
      instance = metricsCollector();
    });

    it("creates a new registry instance for collection", () => {
      expect(RegistryMock.mock.instances).toHaveLength(1);
      expect(CounterMock).toHaveBeenCalledWith(
        expect.objectContaining({
          registers: expect.arrayContaining([RegistryMock.mock.instances[0]]),
        }),
      );
      expect(HistogramMock).toHaveBeenCalledWith(
        expect.objectContaining({
          registers: expect.arrayContaining([RegistryMock.mock.instances[0]]),
        }),
      );
    });
  });

  describe("middleware", () => {
    let contextMock: ParameterizedContext;
    const httpRequestsTotalIncMock = jest.fn();
    const httpRequestDurationSecondsObserveMock = jest.fn();

    beforeEach(() => {
      CounterMock.mockImplementation(
        ({ name }) =>
          ({
            get: jest.fn(),
            inc:
              name === "http_requests_total"
                ? httpRequestsTotalIncMock
                : jest.fn(),
            labels: jest.fn(),
            reset: jest.fn(),
            remove: jest.fn(),
          }) as Counter,
      );
      HistogramMock.mockImplementation(
        ({ name }) =>
          ({
            get: jest.fn(),
            labels: jest.fn(),
            observe:
              name === "http_request_duration_seconds"
                ? httpRequestDurationSecondsObserveMock
                : jest.fn(),
            remove: jest.fn(),
            reset: jest.fn(),
            startTimer: jest.fn(),
            zero: jest.fn(),
          }) as Histogram,
      );
    });

    afterEach(() => {
      httpRequestsTotalIncMock.mockClear();
      httpRequestDurationSecondsObserveMock.mockClear();
      CounterMock.mockReset();
      HistogramMock.mockReset();
    });

    describe("when `excludeFromMetrics` is false", () => {
      beforeEach(() => {
        contextMock = {
          state: { excludeFromMetrics: false },
        } as unknown as ParameterizedContext;
        instance = metricsCollector();
      });

      it("increments the request counter", async () => {
        await instance(contextMock, nextMock);
        expect(httpRequestsTotalIncMock).toHaveBeenCalledTimes(1);
      });

      describe("when `state.responseTime` is undefined", () => {
        beforeEach(() => {
          contextMock.state.responseTime = undefined;
        });

        it("observes the request duration", async () => {
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsObserveMock).not.toHaveBeenCalled();
        });
      });

      describe("when `state.responseTime` has a value", () => {
        beforeEach(() => {
          contextMock.state.responseTime = 300;
        });

        it("observes the request duration", async () => {
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsObserveMock).toHaveBeenCalledTimes(
            1,
          );
        });
      });

      describe("when `state.responseTime` is 0", () => {
        beforeEach(() => {
          contextMock.state.responseTime = 0;
        });

        it("observes the request duration", async () => {
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsObserveMock).toHaveBeenCalledTimes(
            1,
          );
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
        expect(httpRequestsTotalIncMock).not.toHaveBeenCalled();
      });

      it("does not observe the request duration", async () => {
        await instance(contextMock, nextMock);
        expect(httpRequestDurationSecondsObserveMock).not.toHaveBeenCalled();
      });
    });
  });
});
