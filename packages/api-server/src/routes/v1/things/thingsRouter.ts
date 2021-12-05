import Router from "@koa/router";
import { EntityRepository, wrap } from "@mikro-orm/core";
import { DefaultState } from "koa";
import { ability, AbilityState } from "../../../features/auth/ability";
import {
  authenticationRequired,
  AuthenticationRequiredState,
} from "../../../features/auth/authenticationRequired";
import { Thing } from "../../../features/db/entities/Thing";
import {
  thingCreateSchema,
  thingUpdatePartialSchema,
  thingUpdateSchema,
} from "./thingSchemas";

export interface ThingsRouterState extends DefaultState, AbilityState {
  thing?: Thing;
  thingRepository?: EntityRepository<Thing>;
}

export const thingsRouter = new Router<ThingsRouterState>();

thingsRouter
  .use(ability())
  .use((ctx, next) => {
    if (!ctx.state.entityManager) {
      return ctx.throw(500, "entityManager is not undefined!");
    }

    ctx.state.thingRepository = ctx.state.entityManager!.getRepository(Thing);
    return next();
  })
  .get("/", async (ctx) => {
    ctx.body = {
      data: await ctx.state.thingRepository!.findAll(),
    };
    ctx.status = 200;
  })
  .post<AuthenticationRequiredState>(
    "/",
    authenticationRequired(),
    async (ctx) => {
      const { ability, identityId, thingRepository } = ctx.state;
      ability!.ensureCan("create", "Thing");

      const data = thingCreateSchema.parse(ctx.request.body);
      const thing = new Thing(identityId, data.name);
      wrap(thing!).assign(data);

      await thingRepository!.persist(thing).flush();
      ctx.body = { data: thing };
      ctx.status = 201;
    }
  )
  .param(
    "thingId",
    async (thingId, ctx: Router.RouterContext<ThingsRouterState>, next) => {
      const { ability, thingRepository } = ctx.state;

      const query = ability?.query("read", "Thing");

      try {
        ctx.state.thing = await thingRepository!.findOneOrFail({
          ...query,
          id: thingId,
        });
      } catch (err) {
        return ctx.throw(404);
      }

      return next();
    }
  )
  .get("/:thingId", async (ctx) => {
    ctx.body = { data: ctx.state.thing };
    ctx.status = 200;
  })
  .put<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const { ability, identityId, thing, thingRepository } = ctx.state;
      ability!.ensureCan("update", thing!);
      wrap(thing!).assign({
        updatedBy: identityId,
        ...thingUpdateSchema.parse(ctx.request.body),
      });
      await thingRepository!.flush();
      ctx.body = { data: thing };
      ctx.status = 200;
    }
  )
  .patch<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const { ability, identityId, thing, thingRepository } = ctx.state;
      ability!.ensureCan("update", thing!);
      wrap(thing!).assign({
        updatedBy: identityId,
        ...thingUpdatePartialSchema.parse(ctx.request.body),
      });
      await thingRepository!.flush();
      ctx.body = { data: thing };
      ctx.status = 200;
    }
  )
  .delete<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const { ability, thing, thingRepository } = ctx.state;
      ability!.ensureCan("delete", thing!);
      await thingRepository!.removeAndFlush(thing!);
      ctx.status = 204;
    }
  );
