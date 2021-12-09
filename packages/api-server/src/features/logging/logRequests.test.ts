import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import pino from "pino";
import { LoggerState } from "./initializeLogger";
import { logRequests } from "./logRequests";

jest.unmock("./logRequests");

describe("logRequests", () => {
  let logRequestsMiddleware: Middleware;
  let baseLoggerMock: jest.Mocked<pino.Logger>;
  let childLoggerMock: jest.Mocked<pino.Logger>;
  const nextMock = jest.fn();
  let contextMock: ParameterizedContext;

  beforeEach(() => {
    childLoggerMock = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    } as any as jest.Mocked<pino.Logger>;
    baseLoggerMock = {
      child: jest.fn(() => childLoggerMock),
    } as any as jest.Mocked<pino.Logger>;
    logRequestsMiddleware = logRequests();
    contextMock = createMockContext<{ state: LoggerState }>({
      state: {
        logger: childLoggerMock,
      },
    });
    nextMock.mockReset();
  });

  // test("attaches a child logging instance to `context.state.log`", async () => {
  //   await logRequestsMiddleware(contextMock, nextMock);
  //   expect(contextMock.state.log).toBe(childLoggerMock);
  // });

  test("logs the request using the `info` level", async () => {
    await logRequestsMiddleware(contextMock, nextMock);
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
      await logRequestsMiddleware(contextMock, nextMock);
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

    // TODO: should we emit this error?
    // test("emits the error for handling downstream", async () => {
    //   expect(contextMock.app.emit).toHaveBeenCalledWith(
    //     "error",
    //     mockError,
    //     contextMock
    //   );
    // });
  });
});
