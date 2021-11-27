import { MikroORM } from "@mikro-orm/core";
import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import { entityManager } from "./entityManager";

jest.mock("@mikro-orm/core");
jest.unmock("./entityManager");

describe("entityManager", () => {
  let instance: Middleware;
  let contextMock: ParameterizedContext;
  const nextMock = jest.fn();
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
  } as unknown as MikroORM;

  beforeEach(() => {
    contextMock = createMockContext();
    nextMock.mockReset();
    instance = entityManager({ orm: ormMock });
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
