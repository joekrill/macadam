import { MikroORM } from "@mikro-orm/core";
import {
  Configuration,
  FrontendApi,
  IdentityApi,
  Session,
} from "@ory/kratos-client";
import createHttpError from "http-errors";
import Koa from "koa";
import { OrmConfigOptions } from "../db/ormConfig";
import { kratosOrmConfig } from "./kratosOrmConfig";
import { lazyLoadSession } from "./lazyLoadSession";
import { lazyLoadXSessionToken } from "./lazyLoadXSessionToken";

export interface KratosContext {
  kratos: {
    frontendApi: FrontendApi;
    identityApi: IdentityApi;
    orm: MikroORM;
  };
}

export interface KratosState {
  session: () => Promise<Session | undefined>;
  xSessionToken: string | undefined;
  _session?: Session;
}

export interface InitializeKratosOptions
  extends Omit<OrmConfigOptions, "environment" | "logger"> {
  publicUrl: string;
}

/**
 * Initializes a kratos API instance.
 */
export const initializeKratos = async (
  app: Koa,
  { publicUrl, ...ormOptions }: InitializeKratosOptions
) => {
  const config = new Configuration({ basePath: publicUrl });
  const frontendApi = new FrontendApi(config);
  const identityApi = new IdentityApi(config);

  app.use(lazyLoadXSessionToken());
  app.use(lazyLoadSession());

  app.context.logger.debug("Kratos Database connecting");
  const orm = await MikroORM.init(
    kratosOrmConfig({
      environment: app.env,
      logger: app.context.logger,
      findOneOrFailHandler: (entityName: string) =>
        createHttpError(404, `${entityName} not found`),
      ...ormOptions,
    })
  );
  app.context.logger.debug("Kratos Database connected");

  app.context.kratos = {
    frontendApi,
    identityApi,
    orm,
  };

  app.context.addShutdownListener(async () => {
    app.context.logger.debug("Kratos Database connection closing");
    await orm.close();
    app.context.logger.debug("Kratos Database connection closed");
  });
};
