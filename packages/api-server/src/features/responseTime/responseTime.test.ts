import { createMockContext } from "@shopify/jest-koa-mocks";
import { DefaultContext, Middleware, ParameterizedContext } from "koa";
import { responseTime, ResponseTimeState } from "./responseTime";

describe("responseTime", () => {
  let instance: Middleware<ResponseTimeState>;
  const nextMock = jest.fn();
  let contextMock: ParameterizedContext<ResponseTimeState, DefaultContext, any>;

  beforeEach(() => {
    instance = responseTime();
    contextMock = createMockContext();
  });

  test("sets `context.state.responseTime`", async () => {
    await instance(contextMock, nextMock);
    expect(contextMock.state.responseTime).toBeGreaterThan(0);
  });

  test("sets a `Response-Time` header in milliseconds", async () => {
    contextMock.set = jest.fn();
    await instance(contextMock, nextMock);
    expect(contextMock.set).toHaveBeenCalledWith(
      "Response-Time",
      expect.stringMatching(/^\d+ms$/)
    );
  });
});
