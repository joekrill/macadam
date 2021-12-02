import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import { Counter, Histogram, Registry } from "prom-client";
import { metricsCollector } from "./metricsCollector";

jest.unmock("./metricsCollector");

const CounterMock = Counter as jest.Mock<Counter<any>, [{ name: string }]>;
const HistogramMock = Histogram as jest.Mock<
  Histogram<any>,
  [{ name: string }]
>;

const RegistryMock = Registry as unknown as jest.Mock<Registry>;

describe("metricsCollector", () => {
  let instance: Middleware;
  let contextMock: ParameterizedContext;
  const nextMock = jest.fn();
  let httpRequestCountMock: Counter<any>;
  let httpRequestDurationSecondsMock: Histogram<any>;

  beforeEach(() => {
    httpRequestCountMock = {
      inc: jest.fn(),
      labels: jest.fn(),
      reset: jest.fn(),
      remove: jest.fn(),
    };
    const defaultCounterImplementation = CounterMock.getMockImplementation();
    CounterMock.mockImplementation(({ name }) => {
      switch (name) {
        case "http_requests_total":
          return httpRequestCountMock;
        default:
          return defaultCounterImplementation as unknown as Counter<any>;
      }
    });

    httpRequestDurationSecondsMock = {
      labels: jest.fn(),
      reset: jest.fn(),
      remove: jest.fn(),
      observe: jest.fn(),
      startTimer: jest.fn(),
      zero: jest.fn(),
    };

    const defaultHistogramImplementation =
      HistogramMock.getMockImplementation();
    HistogramMock.mockImplementation(({ name }) => {
      switch (name) {
        case "http_request_duration_seconds":
          return httpRequestDurationSecondsMock;
        default:
          return defaultHistogramImplementation as unknown as Histogram<any>;
      }
    });

    instance = metricsCollector();
  });

  describe("initialization", () => {
    beforeEach(() => {});

    it("creates a new registry instance for collection", () => {
      expect(Registry).toHaveBeenCalledTimes(1);
      expect(Counter).toHaveBeenCalledWith(
        expect.objectContaining({
          registers: expect.arrayContaining([RegistryMock.mock.instances[0]]),
        })
      );
      expect(Histogram).toHaveBeenCalledWith(
        expect.objectContaining({
          registers: expect.arrayContaining([RegistryMock.mock.instances[0]]),
        })
      );
    });
  });

  describe("middleware", () => {
    describe("when `excludeFromMetrics` is false", () => {
      const state = { excludeFromMetrics: false };

      it("increments the request counter", async () => {
        contextMock = createMockContext({ state });
        await instance(contextMock, nextMock);
        expect(httpRequestCountMock.inc).toHaveBeenCalled();
      });

      describe("when `state.responseTime` is undefined", () => {
        it("observes the request duration", async () => {
          contextMock = createMockContext({ state });
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsMock.observe).not.toHaveBeenCalled();
        });
      });

      describe("when `state.responseTime` has a value", () => {
        beforeEach(() => {
          contextMock = createMockContext({
            state: { ...state, responseTime: 300 },
          });
        });

        it("observes the request duration", async () => {
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsMock.observe).toHaveBeenCalled();
        });
      });

      describe("when `state.responseTime` is 0", () => {
        beforeEach(() => {
          contextMock = createMockContext({
            state: { ...state, responseTime: 0 },
          });
        });

        it("observes the request duration", async () => {
          await instance(contextMock, nextMock);
          expect(httpRequestDurationSecondsMock.observe).toHaveBeenCalled();
        });
      });
    });

    describe("when `excludeFromMetrics` is true", () => {
      beforeEach(() => {
        contextMock = createMockContext({
          state: { excludeFromMetrics: true, responseTime: 1000 },
        });
      });

      it("does not increment the request counter", async () => {
        await instance(contextMock, nextMock);
        expect(httpRequestCountMock.inc).not.toHaveBeenCalled();
      });

      it("does not observe the request duration", async () => {
        await instance(contextMock, nextMock);
        expect(httpRequestDurationSecondsMock.observe).not.toHaveBeenCalled();
      });
    });
  });
});
