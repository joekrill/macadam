import { beforeEach, expect, it, jest } from "@jest/globals";
import { Middleware, Next, ParameterizedContext } from "koa";
import pino from "pino";
import { logRequests } from "./logRequests.js";

let logRequestsMiddleware: Middleware;
let baseLoggerMock: jest.Mocked<pino.Logger<string>>;
let childLoggerMock: jest.Mocked<pino.Logger<string>>;
const nextMock = jest.fn<Next>();
let contextMock: ParameterizedContext;

beforeEach(() => {
  childLoggerMock = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as jest.Mocked<pino.Logger<string>>;
  baseLoggerMock = {
    child: jest.fn(() => childLoggerMock),
  } as unknown as jest.Mocked<pino.Logger<string>>;
  logRequestsMiddleware = logRequests(baseLoggerMock);
  contextMock = {
    state: {},
  } as ParameterizedContext;
  nextMock.mockReset();
});

it("logs the request using the `info` level", async () => {
  await logRequestsMiddleware(contextMock, nextMock);
  expect(childLoggerMock.info).toHaveBeenCalledWith(
    expect.objectContaining({
      req: contextMock.req,
      res: contextMock.res,
    }),
    "request",
  );
});
