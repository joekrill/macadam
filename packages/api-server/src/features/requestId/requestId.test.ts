import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Middleware, Next, ParameterizedContext } from "koa";

describe("requestId", () => {
  const v4UuidMock = jest.fn();
  jest.unstable_mockModule("uuid", () => ({
    v4: v4UuidMock,
  }));

  let instance: Middleware;
  const nextMock = jest.fn<Next>();
  const setMock = jest.fn();
  let contextMock: ParameterizedContext;
  const mockUuid = "a41e1b45-f819-4daa-b41a-3e1594506bd3";

  beforeEach(async () => {
    const { requestId } = await import("./requestId.js");
    instance = requestId();
    v4UuidMock.mockImplementation(() => mockUuid);
    contextMock = {
      state: {},
      request: {
        headers: {},
      },
      set: setMock,
    } as unknown as ParameterizedContext;
    v4UuidMock.mockReset();
    v4UuidMock.mockReturnValue(mockUuid);
    setMock.mockReset();
  });

  it("sets `context.state.requestId` to the value returned by v4()", async () => {
    await instance(contextMock, nextMock);
    expect(contextMock.state.requestId).toBe(mockUuid);
  });

  it("sets a `Request-ID` to the value returned by v4()", async () => {
    await instance(contextMock, nextMock);
    expect(setMock).toHaveBeenCalledWith("Request-ID", mockUuid);
  });

  describe("when there is a `request-id` header", () => {
    const mockRequestIdHeader = "f0695ff2-9251-487f-967c-a9accc3aa331";
    beforeEach(() => {
      contextMock.request.headers["request-id"] = mockRequestIdHeader;
    });

    it("sets `context.state.requestId` to the `request-id` header value", async () => {
      await instance(contextMock, nextMock);
      expect(contextMock.state.requestId).toBe(mockRequestIdHeader);
    });

    it("sets a `Request-ID` to the `request-id` header value", async () => {
      contextMock.set = jest.fn();
      await instance(contextMock, nextMock);
      expect(contextMock.set).toHaveBeenCalledWith(
        "Request-ID",
        mockRequestIdHeader,
      );
    });

    it("does not call v4()", async () => {
      await instance(contextMock, nextMock);
      expect(v4UuidMock).not.toHaveBeenCalled();
    });
  });

  describe("when there is a `x-request-id` header", () => {
    const mockXRequestIdHeader = "6d03bb89-f613-4651-9995-879d783d919f";
    beforeEach(() => {
      contextMock.request.headers["x-request-id"] = mockXRequestIdHeader;
    });

    it("sets `context.state.requestId` to the `x-request-id` header value", async () => {
      await instance(contextMock, nextMock);
      expect(contextMock.state.requestId).toBe(mockXRequestIdHeader);
    });

    it("sets a `Request-ID` to the `x-request-id` header value", async () => {
      contextMock.set = jest.fn();
      await instance(contextMock, nextMock);
      expect(contextMock.set).toHaveBeenCalledWith(
        "Request-ID",
        mockXRequestIdHeader,
      );
    });

    it("does not call v4()", async () => {
      await instance(contextMock, nextMock);
      expect(v4UuidMock).not.toHaveBeenCalled();
    });
  });
});
