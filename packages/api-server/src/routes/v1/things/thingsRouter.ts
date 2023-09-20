import Router from "@koa/router";
import { FilterQuery } from "@mikro-orm/core";
import { ability } from "../../../features/auth/ability";
import {
  authenticationRequired,
  AuthenticationRequiredState,
} from "../../../features/auth/authenticationRequired";
import { Thing } from "../../../features/db/entities/Thing";
import { ThingModel } from "../../../models/ThingModel";

export const thingsRouter = new Router();

thingsRouter
  .use(ability())
  .get("/", async (ctx) => {
    const thingModel = new ThingModel(ctx);

    const where: FilterQuery<Thing> = {};

    if (ctx.state.urlSearchParams.has("filter[owned]")) {
      const session = await ctx.state.session();
      where.createdBy = session?.identity.id;
    }

    const { entities, pagination } = await thingModel.list({ where });

    ctx.body = { data: entities, pagination };
    ctx.status = 200;
  })
  .post<AuthenticationRequiredState>(
    "/",
    authenticationRequired(),
    async (ctx) => {
      const thingModel = new ThingModel(ctx);
      const thing = await thingModel.create(ctx.request.body);
      ctx.body = { data: thing };
      ctx.status = 201;
    },
  )
  .get("/:thingId", async (ctx) => {
    const id = ctx.params.thingId as string;
    const thingModel = new ThingModel(ctx);
    const thing = await thingModel.get(id);
    ctx.body = { data: thing };
    ctx.status = 200;
  })
  .put<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const id = ctx.params.thingId as string;
      const thingModel = new ThingModel(ctx);
      const thing = await thingModel.update(id, ctx.request.body);
      await thingModel.flush();
      ctx.body = { data: thing };
      ctx.status = 200;
    },
  )
  .patch<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const id = ctx.params.thingId as string;
      const thingModel = new ThingModel(ctx);
      const thing = await thingModel.patch(id, ctx.request.body);
      await thingModel.flush();
      ctx.body = { data: thing };
      ctx.status = 200;
    },
  )
  .delete<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const id = ctx.params.thingId as string;
      const thingModel = new ThingModel(ctx);
      await thingModel.delete(id);
      await thingModel.flush();
      ctx.status = 204;
    },
  );
