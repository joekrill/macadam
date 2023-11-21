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
  const cookiesGetMock = jest.fn();
  let instance: Middleware;
  let contextMock: ParameterizedContext;

  beforeEach(async () => {
    instance = lazyLoadSession();
    contextMock = {
      cookies: {
        get: cookiesGetMock,
      },
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
    cookiesGetMock.mockReset();
  });

  describe("`context.state.session()`", () => {
    it("returns the session", async () => {
      cookiesGetMock.mockImplementation(() => "session_cookie");
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
      cookiesGetMock.mockImplementation(() => "session_cookie");
      instance(contextMock, nextMock);
      expect(toSessionMock).not.toHaveBeenCalled();
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalled();
    });

    it("is cached", async () => {
      cookiesGetMock.mockImplementation(() => "session_cookie");
      instance(contextMock, nextMock);
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalledTimes(1);
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalledTimes(1);
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalledTimes(1);
    });

    it("does not fetch the session when no cookie exists", async () => {
      cookiesGetMock.mockImplementation(() => undefined);
      instance(contextMock, nextMock);
      await contextMock.state.session();
      expect(toSessionMock).not.toHaveBeenCalled();
    });
  });
});
