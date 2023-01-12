import { MikroORM } from "@mikro-orm/core";
import { FrontendApi } from "@ory/kratos-client";
import { createMockContext } from "@shopify/jest-koa-mocks";
import { Middleware, ParameterizedContext } from "koa";
import { forkKratosEntityManager } from "./forkKratosEntityManager";
import { KratosContext } from "./initializeKratos";

jest.mock("@mikro-orm/core");
jest.unmock("./forkKratosEntityManager");

describe("forkKratosEntityManager", () => {
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
  } as unknown as MikroORM;

  beforeEach(() => {
    contextMock = createMockContext<Partial<KratosContext>>({
      customProperties: {
        kratos: {
          orm: ormMock,
          frontendApi: new FrontendApi(),
        },
      },
    });
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
