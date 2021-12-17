import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import Koa from "koa";
import { ormConfig, OrmConfigOptions } from "./ormConfig";

export interface DbContext {
  orm: MikroORM<PostgreSqlDriver>;
}

export interface InitializeDbOptions
  extends Omit<OrmConfigOptions, "environment" | "logger"> {}

/**
 * Initializes a database connection, adds it to the application context,
 * and adds a listener to shutdown gracefully.
 */
export const initializeDb = async (app: Koa, options: InitializeDbOptions) => {
  app.context.logger.debug("Database connecting");
  app.context.orm = await MikroORM.init<PostgreSqlDriver>(
    ormConfig({
      environment: app.env,
      logger: app.context.logger,
      ...options,
    })
  );

  app.context.logger.debug("Database connected");

  app.context.addShutdownListener(async () => {
    app.context.logger.debug("Database connection closing");
    await app.context.orm.close();
    app.context.logger.debug("Database connection closed");
  });
};
