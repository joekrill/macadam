import Router from "@koa/router";
import { EntityRepository } from "@mikro-orm/core";
import { Thing } from "../../orm/entities/Thing";
import { EntityManagerState } from "../../orm/entityManager";

type ThingRouterState = EntityManagerState & {
  thing?: Thing;
  thingRepository: EntityRepository<Thing>;
};

export const router = new Router<ThingRouterState>();

router
  .use((ctx, next) => {
    ctx.state.thingRepository = ctx.state.entityManager.getRepository(Thing);
    return next();
  })
  .param("id", async (id, ctx, next) => {
    const { thingRepository } = ctx.state;
    try {
      ctx.state.thing = await thingRepository.findOneOrFail({ id });
    } catch (err) {
      return (ctx.status = 404);
    }

    return next();
  });

router.get("/", async (ctx) => {
  const { thingRepository } = ctx.state;
  ctx.body = await thingRepository.findAll();
  ctx.status = 200;
});

router.get("/:id", async (ctx) => {
  ctx.body = ctx.state.thing;
  ctx.status = 200;
});

// router.post("/", async (ctx) => {
//   const { thingRepository } = ctx.state;
//   try {
//     ctx.state.thing = thingRepository.create({ name: ctx.request.body.name as string });
//     await thingRepository.persistAndFlush(ctx.state.thing);
//     ctx.body = ctx.state.thing;
//     ctx.status = 201;
//   } catch (err) {
//     console.error(err);
//     ctx.status = 404;
//   }
// });

// router.put("/:id", async (ctx) => {
//   const { thing, thingRepository } = ctx.state;
//   if (!thing) {
//     return ctx.throw(404);
//   }

//   try {
//     // TODO: Validation:
//     thing.name = ctx.request.body.name;
//     await thingRepository.flush();
//     ctx.body = thing;
//     ctx.status = 200;
//   } catch (err) {
//     ctx.status = 404;
//   }
// });

router.delete("/:id", async (ctx) => {
  const { thing, thingRepository } = ctx.state;

  if (!thing) {
    return ctx.throw(404);
  }

  try {
    await thingRepository.removeAndFlush(thing);
    ctx.status = 204;
  } catch (err) {
    ctx.status = 404;
  }
});
