import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";
import { Middleware } from "koa";

export interface ForkEntityManagerState {
  entityManager?: SqlEntityManager<PostgreSqlDriver>;
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
