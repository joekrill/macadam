import { V0alpha1Api } from "@ory/kratos-client";
import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import P from "pino";
import { authentication } from "./authentication";

jest.unmock("./authentication");

describe("authentication()", () => {
  const nextMock = jest.fn();
  const errorMock = jest.fn();
  const toSessionMock = jest.fn();
  let instance: Middleware;
  let contextMock: ParameterizedContext;
  const mockV0alpha1ApiInstance = {
    toSession: toSessionMock,
  };

  beforeEach(async () => {
    (V0alpha1Api as jest.Mock).mockImplementation(
      () => mockV0alpha1ApiInstance
    );
    instance = authentication({ publicUrl: "" });
    contextMock = createMockContext();
    contextMock.state.log = {
      error: errorMock,
    } as unknown as P.Logger;
    await instance(contextMock, nextMock);
  });

  afterEach(() => {
    nextMock.mockReset();
    errorMock.mockReset();
    toSessionMock.mockReset();
  });

  describe("`context.state.kratos`", () => {
    test("is set to the V0alpha1Api instance", async () => {
      expect(contextMock.state.kratos).toBe(mockV0alpha1ApiInstance);
    });
  });

  describe("`context.state.session`", () => {
    test("is a Promise", async () => {
      expect(contextMock.state.session).resolves.toBeUndefined();
    });

    test("is lazy-loaded", async () => {
      expect(toSessionMock).not.toHaveBeenCalled();
      expect(contextMock.state.session).resolves.toBeUndefined();
      expect(toSessionMock).toHaveBeenCalled();
    });

    test("is cached", async () => {
      await contextMock.state.session;
      expect(toSessionMock).toHaveBeenCalledTimes(1);
      await contextMock.state.session;
      expect(toSessionMock).toHaveBeenCalledTimes(1);
      await contextMock.state.session;
      expect(toSessionMock).toHaveBeenCalledTimes(1);
    });
  });
});
