import { createMockContext } from "@shopify/jest-koa-mocks";
import { DefaultContext, Middleware, ParameterizedContext } from "koa";
import { Counter, Histogram, Registry } from "prom-client";
import { metricsCollector, MetricsState } from "./metrics";

jest.unmock("./metrics");

const RegistryMock = Registry as unknown as jest.Mock<Registry>;

describe("metrics", () => {
  describe("metricsCollector", () => {
    describe("initialization", () => {
      let instance: Middleware<MetricsState>;
      let contextMock: ParameterizedContext<MetricsState, DefaultContext, any>;

      beforeEach(() => {
        instance = metricsCollector();
        contextMock = createMockContext();
      });

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
  });
});
