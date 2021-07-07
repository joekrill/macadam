import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import { Logger } from "pino";
import { logging } from "./logging";

jest.unmock("./logging");

describe("logging", () => {
  let loggingMiddleware: Middleware;
  let baseLoggerMock: jest.Mocked<Logger>;
  let childLoggerMock: jest.Mocked<Logger>;
  const nextMock = jest.fn();
  let contextMock: ParameterizedContext;

  beforeEach(() => {
    childLoggerMock = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    } as any as jest.Mocked<Logger>;
    baseLoggerMock = {
      child: jest.fn(() => childLoggerMock),
    } as any as jest.Mocked<Logger>;
    loggingMiddleware = logging(baseLoggerMock);
    contextMock = createMockContext();
    nextMock.mockReset();
  });

  test("attaches a child logging instance to `context.state.log`", async () => {
    await loggingMiddleware(contextMock, nextMock);
    expect(contextMock.state.log).toBe(childLoggerMock);
  });

  test("logs the request using the `info` level", async () => {
    await loggingMiddleware(contextMock, nextMock);
    expect(childLoggerMock.info).toHaveBeenCalledWith(
      expect.objectContaining({
        req: contextMock.req,
        res: contextMock.res,
      }),
      "request"
    );
  });

  describe("when there is an error", () => {
    let mockError = {
      message: "whoops!",
      stack: "stack placeholder",
      name: "MockError",
    };

    beforeEach(async () => {
      nextMock.mockRejectedValue(mockError);
      contextMock.app.emit = jest.fn();
      await loggingMiddleware(contextMock, nextMock);
    });

    test("logs the request using the `error` level", async () => {
      expect(childLoggerMock.error).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: mockError.stack,
          type: mockError.name,
          state: contextMock.state,
        }),
        mockError.message
      );
    });

    test("emits the error for handling downstream", async () => {
      expect(contextMock.app.emit).toHaveBeenCalledWith(
        "error",
        mockError,
        contextMock
      );
    });
  });
});
