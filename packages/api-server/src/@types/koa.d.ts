import "koa";

declare module "koa" {
  interface BaseContext {
    isTerminating?: boolean;
  }
}
