import { EntityManager, MikroORM } from "@mikro-orm/core";
import { Middleware, ParameterizedContext } from "koa";

export interface EntityManagerState {
  entityManager: EntityManager;
}

export interface EntityManagerOptions {
  orm: MikroORM;
}

export const entityManager =
  ({ orm }: EntityManagerOptions): Middleware<Partial<EntityManagerState>> =>
  async (
    ctx: ParameterizedContext<Partial<EntityManagerState>>,
    next: () => Promise<void>
  ): Promise<void> => {
    ctx.state.entityManager = orm.em.fork(true);
    await next();
    await ctx.state.entityManager.flush();
    ctx.state.entityManager.clear();
    ctx.state.entityManager = undefined;
  };
