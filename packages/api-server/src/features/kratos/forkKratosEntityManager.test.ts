import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { MikroORM } from "@mikro-orm/core";
import { Middleware, Next, ParameterizedContext } from "koa";
import { forkKratosEntityManager } from "./forkKratosEntityManager.js";

describe("forkKratosEntityManager", () => {
  let instance: Middleware;
  let contextMock: ParameterizedContext;
  const nextMock = jest.fn<Next>().mockReturnValue(Promise.resolve());
  const flushMock = jest.fn();
  const clearMock = jest.fn();
  const forkMock = jest.fn(() => ({
    flush: flushMock,
    clear: clearMock,
  }));

  const ormMock = {
    em: {
      fork: forkMock,
    },
  } as unknown as MikroORM;

  beforeEach(() => {
    contextMock = {
      state: {},
      kratos: {
        orm: ormMock,
      },
    } as unknown as ParameterizedContext;
    nextMock.mockReset();
    instance = forkKratosEntityManager();
  });

  it("sets the entityManager before calling next", async () => {
    expect.assertions(1);
    nextMock.mockImplementation(() => {
      expect(contextMock.state.kratosEntityManager).toBeDefined();
      return Promise.resolve();
    });
    await instance(contextMock, nextMock);
  });

  it("flushes and clears the entity manager on the downstream", async () => {
    await instance(contextMock, nextMock);
    expect(flushMock).toHaveBeenCalled();
    expect(clearMock).toHaveBeenCalled();
    expect(contextMock.state.kratosEntityManager).toBeUndefined();
  });
});
