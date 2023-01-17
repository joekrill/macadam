import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import pino from "pino";
import { logRequests } from "./logRequests";

jest.unmock("./logRequests");

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
  } as unknown as jest.Mocked<pino.Logger>;
  baseLoggerMock = {
    child: jest.fn(() => childLoggerMock),
  } as unknown as jest.Mocked<pino.Logger>;
  logRequestsMiddleware = logRequests(baseLoggerMock);
  contextMock = createMockContext();
  nextMock.mockReset();
});

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
