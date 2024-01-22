import { MikroORM } from "@mikro-orm/core";
import httpErrors from "http-errors";
import Koa from "koa";
import { ormConfig, OrmConfigOptions } from "./ormConfig.js";

export interface DbContext {
  db: {
    orm: MikroORM;
  };
}

export type InitializeDbOptions = Omit<
  OrmConfigOptions,
  "environment" | "logger"
>;

/**
 * Initializes a database connection, adds it to the application context,
 * and adds a listener to shutdown gracefully.
 */
export const initializeDb = async (app: Koa, options: InitializeDbOptions) => {
  const logger = app.context.logger.child({ module: "db" });
  const orm = await MikroORM.init(
    ormConfig({
      environment: app.env,
      logger,
      findOneOrFailHandler: (entityName: string) =>
        httpErrors(404, `${entityName} not found`),
      ...options,
    }),
  );

  app.context.db = { orm };

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
