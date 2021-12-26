import { EntityManager } from "@mikro-orm/core";
import { Middleware } from "koa";

export interface ForkKratosEntityManagerState {
  kratosEntityManager?: EntityManager;
}

export const forkKratosEntityManager =
  (): Middleware =>
  async (ctx, next): Promise<void> => {
    const kratosEntityManager = ctx.kratos.orm.em.fork(true);
    ctx.state.kratosEntityManager = kratosEntityManager;
    await next();
    await kratosEntityManager.flush();
    kratosEntityManager.clear();
    ctx.state.kratosEntityManager = undefined;
  };
