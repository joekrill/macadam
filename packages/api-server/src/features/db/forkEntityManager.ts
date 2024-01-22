import { EntityManager } from "@mikro-orm/core";
import { Middleware } from "koa";
import { hostname } from "os";

export interface ForkEntityManagerState {
  entityManager?: EntityManager;
}

export const forkEntityManager =
  (): Middleware =>
  async (ctx, next): Promise<void> => {
    const entityManager = ctx.db.orm.em.fork();

    // This will get added to any audit_log entries
    // generated using this forked entity manager.
    entityManager.setFilterParams("auditContext", {
      app: "api-server",
      ip: ctx.ip,
      requestId: ctx.state.requestId,
      hostname: hostname(),
    });

    ctx.state.entityManager = entityManager;
    await next();
    await entityManager.flush();
    entityManager.clear();
    ctx.state.entityManager = undefined;
  };
