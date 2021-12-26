import { MikroORM } from "@mikro-orm/core";
import { Configuration, Session, V0alpha2Api } from "@ory/kratos-client";
import Koa from "koa";
import { OrmConfigOptions } from "../db/ormConfig";
import { kratosOrmConfig } from "./kratosOrmConfig";
import { lazyLoadSession } from "./lazyLoadSession";

export interface KratosContext {
  kratos: {
    publicApi: V0alpha2Api;
    orm: MikroORM;
  };
}

export interface KratosState {
  session: () => Promise<Session>;
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
  const publicApi = new V0alpha2Api(config);
  app.use(lazyLoadSession());

  app.context.logger.debug("Kratos Database connecting");
  const orm = await MikroORM.init(
    kratosOrmConfig({
      environment: app.env,
      logger: app.context.logger,
      ...ormOptions,
    })
  );
  app.context.logger.debug("Kratos Database connected");

  app.context.kratos = {
    publicApi,
    orm,
  };

  app.context.addShutdownListener(async () => {
    app.context.logger.debug("Kratos Database connection closing");
    await orm.close();
    app.context.logger.debug("Kratos Database connection closed");
  });
};
