import Router from "@koa/router";
import { EntityRepository, QueryOrder } from "@mikro-orm/core";
import { DefaultState } from "koa";
import { ability, AbilityState } from "../../../features/auth/ability";
import {
  authenticationRequired,
  AuthenticationRequiredState,
} from "../../../features/auth/authenticationRequired";
import { KratosSession } from "../../../features/kratos/entities/KratosSession";
import { OffsetPagination } from "../../../features/pagination/OffsetPagination";
import { sortStringToOrderBy } from "../../../features/sorting/sortStringToOrderBy";

export interface SessionsRouterState extends DefaultState, AbilityState {
  kratosSession?: KratosSession;
  sessionRepository?: EntityRepository<KratosSession>;
}

export const sessionsRouter = new Router<SessionsRouterState>();

sessionsRouter
  .use(ability())
  .use(authenticationRequired())
  .use((ctx, next) => {
    ctx.state.sessionRepository =
      ctx.state.kratosEntityManager!.getRepository(KratosSession);

    return next();
  })
  .get("/", async (ctx) => {
    const { kratosEntityManager, sessionRepository, urlSearchParams } =
      ctx.state;

    const pagination = new OffsetPagination(urlSearchParams, {
      defaultLimit: 25,
    });
    const orderBy = sortStringToOrderBy(
      urlSearchParams.get("sort"),
      Array.from(
        kratosEntityManager!
          .getMetadata()
          .get(KratosSession.name)
          .propertyOrder.keys()
      )
    ) || { authenticated_at: QueryOrder.DESC };

    // TODO: Currently `listMySessions` is very limited - not sorting; does not
    // return the _current_ sessions. We can replace direct DB access when
    // those things are addressed.
    // const sessions = await ctx.kratos.frontendApi.listMySessions({
    //   xSessionToken: ctx.state.xSessionToken,
    //   cookie: ctx.request.headers["cookie"],
    //   page: pagination.page,
    //   perPage: pagination.limit,
    // });

    const [data, total] = await sessionRepository!.findAndCount(
      {},
      {
        ...pagination.findOptions(),
        orderBy,
      }
    );

    ctx.body = {
      data,
      ...pagination.meta(data.length, total),
    };
    ctx.status = 200;
  })
  .param(
    "sessionId",
    async (sessionId, ctx: Router.RouterContext<SessionsRouterState>, next) => {
      const { ability, sessionRepository } = ctx.state;

      const query = ability?.query("read", KratosSession.modelName);

      try {
        ctx.state.kratosSession = await sessionRepository!.findOneOrFail({
          ...query,
          id: sessionId,
        });
      } catch (err) {
        return ctx.throw(404);
      }

      return next();
    }
  )
  .get("/:sessionId", async (ctx) => {
    ctx.body = { data: ctx.state.kratosSession };
    ctx.status = 200;
  })
  .delete<AuthenticationRequiredState>("/:sessionId", async (ctx) => {
    if (!ctx.state.kratosSession!.token) {
      return ctx.throw(405);
    }

    await ctx.kratos.frontendApi.performNativeLogout({
      performNativeLogoutBody: {
        session_token: ctx.state.kratosSession!.token,
      },
    });
    ctx.status = 204;
  });
