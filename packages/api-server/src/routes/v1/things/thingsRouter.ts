import Router from "@koa/router";
import { EntityRepository, wrap } from "@mikro-orm/core";
import { OperatorMap } from "@mikro-orm/core/typings";
import { DefaultState } from "koa";
import { ability, AbilityState } from "../../../features/auth/ability";
import {
  authenticationRequired,
  AuthenticationRequiredState,
} from "../../../features/auth/authenticationRequired";
import { Thing } from "../../../features/db/entities/Thing";
import { textSearch } from "../../../features/db/filters/textSearch";
import { OffsetPagination } from "../../../features/pagination/OffsetPagination";
import { sortStringToOrderBy } from "../../../features/sorting/sortStringToOrderBy";
import {
  thingCreateSchema,
  thingUpdatePartialSchema,
  thingUpdateSchema,
} from "./thingsSchemas";

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
    const { entityManager, thingRepository, urlSearchParams } = ctx.state;

    const pagination = new OffsetPagination(urlSearchParams);
    const orderBy = sortStringToOrderBy(
      urlSearchParams.get("sort"),

      // This seems to be the simplest way to get the list of property keys
      // from the entity metadata.
      Array.from(
        entityManager!.getMetadata().get(Thing.name).propertyOrder.keys()
      )
    );

    const filter = { $and: [] } as OperatorMap<Thing>;

    if (urlSearchParams.has("filter[owned]")) {
      const session = await ctx.state.session();
      filter.$and!.push({
        createdBy: session?.identity.id,
      });
    }

    const searchTerm = urlSearchParams.get("filter[search]")?.trim();
    if (searchTerm) {
      filter.$and!.push(
        textSearch(
          ctx.state.entityManager!,
          ["name", "description"],
          searchTerm
        )
      );
    }

    const [data, total] = await thingRepository!.findAndCount(filter, {
      ...pagination.findOptions(),
      orderBy,
    });

    ctx.body = {
      data,
      ...pagination.meta(data.length, total),
    };
    ctx.status = 200;
  })
  .post<AuthenticationRequiredState>(
    "/",
    authenticationRequired(),
    async (ctx) => {
      const { ability, identityId, thingRepository } = ctx.state;
      ability!.ensureCan("create", Thing.modelName);

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

      const query = ability?.query("read", Thing.modelName);

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
      const { ability, identityId, thing, thingRepository } = ctx.state;
      ability!.ensureCan("delete", thing!);
      wrap(thing!).assign({
        updatedBy: identityId,
        deletedAt: new Date(),
      });
      await thingRepository!.flush();
      // await thingRepository!.removeAndFlush(thing!);
      ctx.status = 204;
    }
  );
