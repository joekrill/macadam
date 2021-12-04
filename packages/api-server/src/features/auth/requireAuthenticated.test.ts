import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import { requireAuthenticated } from "./requireAuthenticated";

jest.unmock("./requireAuthenticated");

describe("requireAuthenticated", () => {
  let instance: Middleware;
  const nextMock = jest.fn();
  let contextMock: ParameterizedContext;

  beforeEach(() => {
    instance = requireAuthenticated();
  });

  describe("when `state` includes a session", () => {
    beforeEach(async () => {
      contextMock = createMockContext({ state: { session: {} } });
      await instance(contextMock, nextMock);
    });

    it("calls next", () => {
      expect(nextMock).toHaveBeenCalled();
    });
  });

  describe("when `state` does not include a session", () => {
    beforeEach(async () => {
      contextMock = createMockContext({ state: { session: undefined } });
      await instance(contextMock, nextMock);
    });

    it("throws a 401 error to koa", () => {
      expect(contextMock.throw).toHaveBeenCalledWith(401);
    });
  });
});
