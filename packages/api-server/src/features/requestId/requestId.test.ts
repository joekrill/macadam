import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import { v4 } from "uuid";
import { requestId } from "./requestId";

jest.unmock("./requestId");

const v4UuidMock = v4 as jest.Mock;

describe("requestId", () => {
  let instance: Middleware;
  const nextMock = jest.fn();
  let contextMock: ParameterizedContext;
  const mockUuid = "a41e1b45-f819-4daa-b41a-3e1594506bd3";

  beforeEach(() => {
    instance = requestId();
    contextMock = createMockContext();
    v4UuidMock.mockReset();
    v4UuidMock.mockReturnValue(mockUuid);
  });

  test("sets `context.state.requestId` to the value returned by v4()", async () => {
    await instance(contextMock, nextMock);
    expect(contextMock.state.requestId).toBe(mockUuid);
  });

  test("sets a `Request-ID` to the value returned by v4()", async () => {
    contextMock.set = jest.fn();
    await instance(contextMock, nextMock);
    expect(contextMock.set).toHaveBeenCalledWith("Request-ID", mockUuid);
  });

  describe("when there is a `request-id` header", () => {
    const mockRequestIdHeader = "f0695ff2-9251-487f-967c-a9accc3aa331";
    beforeEach(() => {
      contextMock.req.headers["request-id"] = mockRequestIdHeader;
    });

    test("sets `context.state.requestId` to the `request-id` header value", async () => {
      await instance(contextMock, nextMock);
      expect(contextMock.state.requestId).toBe(mockRequestIdHeader);
    });

    test("sets a `Request-ID` to the `request-id` header value", async () => {
      contextMock.set = jest.fn();
      await instance(contextMock, nextMock);
      expect(contextMock.set).toHaveBeenCalledWith(
        "Request-ID",
        mockRequestIdHeader
      );
    });

    test("does not call v4()", async () => {
      await instance(contextMock, nextMock);
      expect(v4UuidMock).not.toHaveBeenCalled();
    });
  });

  describe("when there is a `x-request-id` header", () => {
    const mockXRequestIdHeader = "6d03bb89-f613-4651-9995-879d783d919f";
    beforeEach(() => {
      contextMock.req.headers["x-request-id"] = mockXRequestIdHeader;
    });

    test("sets `context.state.requestId` to the `x-request-id` header value", async () => {
      await instance(contextMock, nextMock);
      expect(contextMock.state.requestId).toBe(mockXRequestIdHeader);
    });

    test("sets a `Request-ID` to the `x-request-id` header value", async () => {
      contextMock.set = jest.fn();
      await instance(contextMock, nextMock);
      expect(contextMock.set).toHaveBeenCalledWith(
        "Request-ID",
        mockXRequestIdHeader
      );
    });

    test("does not call v4()", async () => {
      await instance(contextMock, nextMock);
      expect(v4UuidMock).not.toHaveBeenCalled();
    });
  });
});
