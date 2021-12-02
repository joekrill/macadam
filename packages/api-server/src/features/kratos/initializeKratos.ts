import { Configuration, Session, V0alpha2Api } from "@ory/kratos-client";
import Koa from "koa";
import { lazyLoadSession } from "./lazyLoadSession";

export interface KratosContext {
  kratosPublicApi: V0alpha2Api;
}

export interface KratosState {
  session?: Promise<Session>;
}

export interface InitializeKratosOptions {
  publicUrl: string;
}

/**
 * Initializes a kratos API instance.
 */
export const initializeKratos = async (
  app: Koa,
  { publicUrl }: InitializeKratosOptions
) => {
  const config = new Configuration({ basePath: publicUrl });
  app.context.kratosPublicApi = new V0alpha2Api(config);
  app.use(lazyLoadSession());
};
