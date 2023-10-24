import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Middleware, Next, ParameterizedContext } from "koa";
import { forkEntityManager } from "./forkEntityManager.js";

describe("forkEntityManager", () => {
  let instance: Middleware;
  let contextMock: ParameterizedContext;
  const nextMock = jest.fn<Next>().mockReturnValue(Promise.resolve());
  const flushMock = jest.fn();
  const clearMock = jest.fn();
  const forkMock = jest.fn(() => ({
    flush: flushMock,
    clear: clearMock,
    setFilterParams: jest.fn(),
  }));

  const ormMock = {
    em: {
      fork: forkMock,
    },
  } as unknown as MikroORM<PostgreSqlDriver>;

  beforeEach(() => {
    contextMock = {
      db: { orm: ormMock },
      state: { requestId: "xxx" },
    } as unknown as ParameterizedContext;
    nextMock.mockReset();
    instance = forkEntityManager();
  });

  it("sets the entityManager before calling next", async () => {
    expect.assertions(1);
    nextMock.mockImplementation(() => {
      expect(contextMock.state.entityManager).toBeDefined();
      return Promise.resolve();
    });
    await instance(contextMock, nextMock);
  });

  it("flushes and clears the entity manager on the downstream", async () => {
    await instance(contextMock, nextMock);
    expect(flushMock).toHaveBeenCalled();
    expect(clearMock).toHaveBeenCalled();
    expect(contextMock.state.entityManager).toBeUndefined();
  });
});
