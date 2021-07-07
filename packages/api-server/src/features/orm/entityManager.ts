import { EntityManager, MikroORM } from "@mikro-orm/core";
import { Middleware } from "koa";

export interface EntityManagerState {
  entityManager?: EntityManager;
}

export interface EntityManagerOptions {
  orm: MikroORM;
}

export const entityManager =
  ({ orm }: EntityManagerOptions): Middleware =>
  async (ctx, next): Promise<void> => {
    ctx.state.entityManager = orm.em.fork(true);
    await next();
    await ctx.state.entityManager.flush();
    ctx.state.entityManager.clear();
    ctx.state.entityManager = undefined;
  };
