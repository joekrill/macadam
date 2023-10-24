import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { Middleware, Next, ParameterizedContext } from "koa";
import { lazyLoadSession } from "./lazyLoadSession.js";

describe("lazyLoadSession()", () => {
  const nextMock = jest.fn<Next>();
  const errorMock = jest.fn();
  const toSessionMock = jest.fn();
  let instance: Middleware;
  let contextMock: ParameterizedContext;

  beforeEach(async () => {
    instance = lazyLoadSession();
    contextMock = {
      request: {
        headers: {},
      },
      kratos: {
        frontendApi: {
          toSession: toSessionMock,
        },
      },
      state: {
        logger: {
          debug: jest.fn(),
          error: errorMock,
        },
        entityManager: {
          setFilterParams: jest.fn(),
        },
      },
    } as unknown as ParameterizedContext;
  });

  afterEach(() => {
    nextMock.mockReset();
    errorMock.mockReset();
    toSessionMock.mockReset();
  });

  describe("`context.state.session()`", () => {
    it("returns the session", async () => {
      const mockSession = Symbol("mockSession");
      toSessionMock.mockImplementation(() => ({
        data: mockSession,
      }));
      instance(contextMock, nextMock);
      expect(contextMock.state.session).toBeDefined();
      const session = await contextMock.state.session();
      expect(session).toBe(mockSession);
    });

    it("is lazy-loaded", async () => {
      instance(contextMock, nextMock);
      expect(toSessionMock).not.toHaveBeenCalled();
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalled();
    });

    it("is cached", async () => {
      instance(contextMock, nextMock);
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalledTimes(1);
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalledTimes(1);
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalledTimes(1);
    });
  });
});
