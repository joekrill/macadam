import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import P from "pino";
import { lazyLoadSession } from "./lazyLoadSession";

jest.unmock("./lazyLoadSession");
jest.unmock("zod");

describe("lazyLoadSession()", () => {
  const nextMock = jest.fn();
  const errorMock = jest.fn();
  const toSessionMock = jest.fn();
  let instance: Middleware;
  let contextMock: ParameterizedContext;
  const mockV0alpha1ApiInstance = {
    toSession: toSessionMock,
  };

  beforeEach(async () => {
    instance = lazyLoadSession();
    contextMock = createMockContext({
      customProperties: {
        kratosPublicApi: mockV0alpha1ApiInstance,
      },
    });
    contextMock.state.logger = {
      debug: jest.fn(),
      error: errorMock,
    } as unknown as P.Logger;
  });

  afterEach(() => {
    nextMock.mockReset();
    errorMock.mockReset();
    toSessionMock.mockReset();
  });

  describe("`context.state.session()`", () => {
    test("is a Promise", async () => {
      instance(contextMock, nextMock);
      expect(contextMock.state.session()).resolves.toBeUndefined();
    });

    test("is lazy-loaded", async () => {
      instance(contextMock, nextMock);
      expect(toSessionMock).not.toHaveBeenCalled();
      await contextMock.state.session();
      expect(toSessionMock).toHaveBeenCalled();
    });

    test("is cached", async () => {
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
