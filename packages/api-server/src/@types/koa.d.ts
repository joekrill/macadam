import "koa";
import { AbilityState } from "../features/auth/ability";
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
import { MailerContext } from "../features/mailer/initializeMailer";
import { MetricsCollectorState } from "../features/metrics/metricsCollector";
import { URLSearchParamsState } from "../features/querystring/urlSearchParams";
import { RedisContext } from "../features/redis/initializeRedis";
import { RequestIdState } from "../features/requestId/requestId";
import { ResponseTimeState } from "../features/responseTime/responseTime";
import { SentryContext } from "../features/sentry/initializeSentry";
import { ShutdownContext } from "../features/shutdown/initializeGracefulShutdown";

declare module "koa" {
  interface Request {
    body?: unknown;
  }

  interface DefaultContext
    extends DbContext,
      KratosContext,
      LoggerContext,
      MailerContext,
      RedisContext,
      SentryContext,
      ShutdownContext {}

  // I'm not totally sure this is the best way to handle these typings.
  interface DefaultState
    extends ForkEntityManagerState,
      ForkKratosEntityManagerState,
      KratosState,
      LoggerState,
      MetricsCollectorState,
      RequestIdState,
      ResponseTimeState,
      AbilityState,
      URLSearchParamsState {}
}
