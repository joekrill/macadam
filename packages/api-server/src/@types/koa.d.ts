import "koa";
import { SessionState } from "../features/auth/authentication";
import { AuthorizeState } from "../features/auth/authorize";
import { ForkEntityManagerState } from "../features/db/forkEntityManager";
import { DbContext } from "../features/db/initializeDb";
import { ForkKratosEntityManagerState } from "../features/kratos/forkKratosEntityManager";
import {
  KratosContext,
  KratosState,
} from "../features/kratos/initializeKratos";
import {
  LoggerContext,
  LoggerState,
} from "../features/logging/initializeLogger";
import { MetricsCollectorState } from "../features/metrics/metricsCollector";
import { URLSearchParamsState } from "../features/querystring/urlSearchParams";
import { RedisContext } from "../features/redis/initializeRedis";
import { RequestIdState } from "../features/requestId/requestId";
import { ResponseTimeState } from "../features/responseTime/responseTime";

declare module "koa" {
  interface DefaultContext
    extends KratosContext,
      LoggerContext,
      DbContext,
      RedisContext,
      ShutdownContext {}

  // I'm not totally sure this is the best way to handle these typings.
  interface DefaultState
    extends AuthorizeState,
      ForkEntityManagerState,
      ForkKratosEntityManagerState,
      KratosState,
      LoggerState,
      MetricsCollectorState,
      RequestIdState,
      ResponseTimeState,
      SessionState,
      URLSearchParamsState {}
}
