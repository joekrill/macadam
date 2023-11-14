import { MikroORM } from "@mikro-orm/core";
import {
  Configuration,
  FrontendApi,
  IdentityApi,
  Session,
} from "@ory/kratos-client";
import httpErrors from "http-errors";
import Koa from "koa";
import { OrmConfigOptions } from "../db/ormConfig.js";
import { kratosOrmConfig } from "./kratosOrmConfig.js";
import { lazyLoadSession } from "./lazyLoadSession.js";
import { lazyLoadXSessionToken } from "./lazyLoadXSessionToken.js";

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
  { publicUrl, ...ormOptions }: InitializeKratosOptions,
) => {
  const logger = app.context.logger.child({ module: "kratos" });
  const config = new Configuration({ basePath: publicUrl });
  const frontendApi = new FrontendApi(config);
  const identityApi = new IdentityApi(config);

  app.use(lazyLoadXSessionToken());
  app.use(lazyLoadSession());

  const orm = await MikroORM.init(
    kratosOrmConfig({
      environment: app.env,
      logger,
      findOneOrFailHandler: (entityName: string) =>
        httpErrors(404, `${entityName} not found`),
      ...ormOptions,
    }),
  );

  app.context.kratos = {
    frontendApi,
    identityApi,
    orm,
  };

  app.context.addShutdownListener(async () => {
    const start = performance.now();
    logger.info("Database connection closing...");
    await orm.close();
    logger.info(
      { duration: (performance.now() - start).toFixed() },
      "Database connection closed",
    );
  });
};
