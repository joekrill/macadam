import "koa";
import { SessionState } from "../features/auth/authentication";
import { ForkEntityManagerState } from "../features/db/forkEntityManager";
import { DbContext } from "../features/db/initializeDb";
import {
  KratosContext,
  KratosState,
} from "../features/kratos/initializeKratos";
import {
  LoggerContext,
  LoggerState,
} from "../features/logging/initializeLogger";
import { MetricsCollectorState } from "../features/metrics/metricsCollector";
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
    extends ForkEntityManagerState,
      KratosState,
      LoggerState,
      MetricsCollectorState,
      RequestIdState,
      ResponseTimeState,
      SessionState {}
}
