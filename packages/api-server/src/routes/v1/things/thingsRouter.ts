import Router from "@koa/router";
import { FilterQuery } from "@mikro-orm/core";
import { z } from "zod";
import { ability } from "../../../features/auth/ability.js";
import {
  AuthenticationRequiredState,
  authenticationRequired,
} from "../../../features/auth/authenticationRequired.js";
import { Thing } from "../../../features/db/entities/Thing.js";
import { OffsetPagination } from "../../../features/pagination/OffsetPagination.js";
import { Sorting } from "../../../features/sorting/Sorting.js";

const thingCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().nullable().optional(),
  isPublic: z.boolean().default(false), // TODO: any way to extract this from the entity definition?
});

const thingUpdateSchema = thingCreateSchema.extend({
  description: z.string().nullish().default(null),
});

const thingUpdatePartialSchema = thingCreateSchema.extend({
  name: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const thingsRouter = new Router();

thingsRouter
  .use(ability())
  .get("/", async (ctx) => {
    const em = ctx.state.entityManager!;
    const thingRepository = em.getRepository(Thing);
    const pagination = new OffsetPagination(ctx.state.urlSearchParams);
    const sorting = new Sorting<Thing>(ctx.state.urlSearchParams, {
      entityManager: em,
      entityType: Thing,
    });
    const where: FilterQuery<Thing> = {};

    if (ctx.state.urlSearchParams.has("filter[owned]")) {
      const session = await ctx.state.session();
      where.createdBy = session?.identity?.id || "X";
    }

    const [things, count] = await thingRepository.findAndCount(where, {
      ...pagination.findOptions(),
      orderBy: sorting.orderBy,
      filters: {
        search: {
          query: ctx.state.urlSearchParams.get("filter[search]"),
        },
      },
    });

    ctx.body = {
      ...pagination.meta(things.length, count),
      data: things,
    };
    ctx.status = 200;
  })
  .post<AuthenticationRequiredState>(
    "/",
    authenticationRequired(),
    async (ctx) => {
      ctx.state.ability!.ensureCan("create", "Thing");
      const em = ctx.state.entityManager!;
      const thingRepository = em.getRepository(Thing);
      const properties = thingCreateSchema.parse(ctx.request.body);
      const thing = thingRepository.create(properties);
      await em.persistAndFlush(thing);
      ctx.body = { data: thing };
      ctx.status = 201;
    },
  )
  .get("/:thingId", async (ctx) => {
    const em = ctx.state.entityManager!;
    const thingRepository = em.getRepository(Thing);
    const id = ctx.params.thingId as string;
    const thing = await thingRepository.findOneOrFail({ id });
    ctx.body = { data: thing };
    ctx.status = 200;
  })
  .head("/:thingId", async (ctx) => {
    const em = ctx.state.entityManager!;
    const thingRepository = em.getRepository(Thing);
    const id = ctx.params.thingId as string;
    const count = await thingRepository.count({ id });
    ctx.status = count ? 200 : 404;
  })
  .put<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const em = ctx.state.entityManager!;
      const thingRepository = em.getRepository(Thing);
      const id = ctx.params.thingId as string;
      const thing = await thingRepository.findOneOrFail({ id });
      ctx.state.ability!.ensureCan("update", thing);
      const properties = thingUpdateSchema.parse(ctx.request.body);
      await thingRepository.assign(thing, properties);
      await em.flush();
      ctx.body = { data: thing };
      ctx.status = 200;
    },
  )
  .patch<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const em = ctx.state.entityManager!;
      const thingRepository = em.getRepository(Thing);
      const id = ctx.params.thingId as string;
      const thing = await thingRepository.findOneOrFail({ id });
      ctx.state.ability!.ensureCan("update", thing);
      const properties = thingUpdatePartialSchema.parse(ctx.request.body);
      await thingRepository.assign(thing, properties);
      await em.flush();
      ctx.body = { data: thing };
      ctx.status = 200;
    },
  )
  .delete<AuthenticationRequiredState>(
    "/:thingId",
    authenticationRequired(),
    async (ctx) => {
      const em = ctx.state.entityManager!;
      const thingRepository = em.getRepository(Thing);
      const id = ctx.params.thingId as string;
      const thing = await thingRepository.findOneOrFail({ id });
      ctx.state.ability!.ensureCan("delete", thing);
      await em.removeAndFlush(thing);
      ctx.status = 204;
    },
  );
