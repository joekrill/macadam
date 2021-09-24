import "koa";
import { SessionState } from "../features/auth/authentication";
import { HealthState } from "../features/health/health";
import { LoggingState } from "../features/logging/logging";
import { MetricsState } from "../features/metrics/metrics";
import { EntityManagerState } from "../features/orm/entityManager";
import { RequestIdState } from "../features/requestId/requestId";
import { ResponseTimeState } from "../features/responseTime/responseTime";

declare module "koa" {
  interface DefaultContext {
    /**
     * Set to true when the app starts shutting down and no further requests
     * should be handled.
     */
    isTerminating?: boolean;
  }

  // I'm not totally sure this is the best way to handle these typings.
  interface DefaultState
    extends EntityManagerState,
      HealthState,
      LoggingState,
      MetricsState,
      RequestIdState,
      ResponseTimeState,
      SessionState {}
}
