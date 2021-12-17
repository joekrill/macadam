import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import { forkEntityManager } from "./forkEntityManager";
import { DbContext } from "./initializeDb";

jest.mock("@mikro-orm/core");
jest.unmock("./forkEntityManager");

describe("forkEntityManager", () => {
  let instance: Middleware;
  let contextMock: ParameterizedContext;
  const nextMock = jest.fn().mockReturnValue(Promise.resolve());
  const flushMock = jest.fn();
  const clearMock = jest.fn();
  const forkMock = jest.fn().mockImplementation(() => ({
    flush: flushMock,
    clear: clearMock,
  }));

  const ormMock = {
    em: {
      fork: forkMock,
    },
  } as unknown as MikroORM<PostgreSqlDriver>;

  beforeEach(() => {
    contextMock = createMockContext<DbContext>({
      customProperties: { orm: ormMock },
    });
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
