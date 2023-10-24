import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Middleware, Next, ParameterizedContext } from "koa";
import { responseTime } from "./responseTime.js";

jest.unmock("./responseTime");

describe("responseTime", () => {
  let instance: Middleware;
  const nextMock = jest.fn<Next>();
  let contextMock: ParameterizedContext;

  beforeEach(() => {
    instance = responseTime();
    contextMock = {
      set: jest.fn(),
      state: {},
    } as unknown as ParameterizedContext;
  });

  it("sets `context.state.responseTime`", async () => {
    await instance(contextMock, nextMock);
    expect(contextMock.state.responseTime).toBeGreaterThan(0);
  });

  it("sets a `Response-Time` header in milliseconds", async () => {
    contextMock.set = jest.fn();
    await instance(contextMock, nextMock);
    expect(contextMock.set).toHaveBeenCalledWith(
      "Response-Time",
      expect.stringMatching(/^\d+ms$/),
    );
  });
});
