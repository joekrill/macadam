import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Middleware, Next, ParameterizedContext } from "koa";
import { authenticationRequired } from "./authenticationRequired.js";

describe("authenticationRequired", () => {
  let instance: Middleware;
  const nextMock = jest.fn<Next>();
  let contextMock: ParameterizedContext;

  beforeEach(() => {
    instance = authenticationRequired();
  });

  describe("when `state` includes a session", () => {
    const sessionMock = { identity: { id: "123" } };

    beforeEach(async () => {
      const sessionGetterMock = jest.fn(() => Promise.resolve(sessionMock));
      contextMock = {
        state: { session: sessionGetterMock },
        throw: jest.fn(),
      } as unknown as ParameterizedContext;
      await instance(contextMock, nextMock);
    });

    it("calls next", () => {
      expect(nextMock).toHaveBeenCalled();
    });
  });

  describe("when `state` does not include a session", () => {
    beforeEach(async () => {
      const sessionGetterMock = jest.fn(() => Promise.resolve(undefined));
      contextMock = {
        state: { session: sessionGetterMock },
        throw: jest.fn(),
      } as unknown as ParameterizedContext;
      await instance(contextMock, nextMock);
    });

    it("throws a 401 error to koa", () => {
      expect(contextMock.throw).toHaveBeenCalledWith(401);
    });
  });
});
