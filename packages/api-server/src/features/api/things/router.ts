import Router from "@koa/router";
import { EntityRepository } from "@mikro-orm/core";
import { Context, DefaultState } from "koa";
import { Thing } from "../../db/entities/Thing";

interface ThingRouterState extends DefaultState {
  thing?: Thing;
  thingRepository?: EntityRepository<Thing>;
}

export const router = new Router<DefaultState, Context>();

// This is a bit of a typescript workaround until @koa/router is typed
// correctly to support middleware type enhancements.
// This may help: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/54209
// But it doesn't handle `use()` and `param()` use-cases
(router as unknown as Router<ThingRouterState, Context>)
  .use((ctx, next) => {
    if (!ctx.state.entityManager) {
      return ctx.throw(500, "entityManager is not undefined!");
    }

    ctx.state.thingRepository = ctx.state.entityManager?.getRepository(Thing);
    return next();
  })
  .param(
    "id",
    async (id, ctx: Router.RouterContext<ThingRouterState>, next) => {
      const { thingRepository } = ctx.state;
      try {
        ctx.state.thing = await thingRepository!.findOneOrFail({ id });
      } catch (err) {
        return ctx.throw(404);
      }

      return next();
    }
  )
  .get("/", async (ctx) => {
    const { thingRepository } = ctx.state;
    ctx.body = await thingRepository!.findAll();
    ctx.status = 200;
    console.log("foo", ctx.body);
  })
  .get("/:id", async (ctx) => {
    ctx.body = ctx.state.thing;
    ctx.status = 200;
  })
  .delete("/:id", async (ctx) => {
    const { thing, thingRepository } = ctx.state;

    if (!thing) {
      return ctx.throw(404);
    }

    try {
      await thingRepository!.removeAndFlush(thing);
      ctx.status = 204;
    } catch (err) {
      ctx.status = 404;
    }
  });
