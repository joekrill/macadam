import { EntityManager } from "@mikro-orm/core";
import { Middleware } from "koa";

export interface ForkEntityManagerState {
  entityManager?: EntityManager;
}

export const forkEntityManager =
  (): Middleware =>
  async (ctx, next): Promise<void> => {
    const entityManager = ctx.orm.em.fork(true);
    ctx.state.entityManager = entityManager;
    await next();
    await entityManager.flush();
    entityManager.clear();
    ctx.state.entityManager = undefined;
  };
