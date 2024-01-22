import { Options, SimpleLogger } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import {
  PostgreSqlDriver,
  defineConfig as definePostgreSqlConfig,
} from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import {
  SqliteDriver,
  defineConfig as defineSqliteConfig,
} from "@mikro-orm/sqlite";
import pino from "pino";
import { URL } from "url";
import { PinoLogger } from "./PinoLogger.js";
import { entities } from "./entities/index.js";
import { subscribers } from "./subscribers/index.js";

export interface OrmConfigOptions extends Omit<Partial<Options>, "logger"> {
  clientUrl: string;
  environment: string;
  logger?: pino.Logger;
}

export const ormConfig = ({
  clientUrl,
  environment,
  logger,
  ...options
}: OrmConfigOptions): Options => {
  const url = new URL(clientUrl);

  const migrationsPath = "./build/features/db/migrations";
  const migrationspathTs = "./src/features/db/migrations";

  const config: Options = {
    extensions: [Migrator], // those would have a static `register` method
    entities: [...entities],
    subscribers,
    debug: environment === "development",
    highlighter: new SqlHighlighter(),
    metadataProvider: TsMorphMetadataProvider,

    // the logger property is still needed even though we `loggerFactory` is
    // also specified because it is what is returned when calling `em.get('config')`
    // and is used in some places (i.e. migrations)
    ...(logger ? { logger: (message) => logger.debug(message) } : {}),
    loggerFactory: (loggerOptions) =>
      logger
        ? new PinoLogger({ logger, ...loggerOptions })
        : new SimpleLogger(loggerOptions),

    migrations: {
      glob: "!(*.d).{js,ts,mjs,mts,cjs,cts}",
      path: environment === "test" ? migrationspathTs : migrationsPath,
      pathTs: migrationspathTs,
      tableName: "migrations",
      transactional: true,
      safe: true,
      emit: "ts",
      allOrNothing: true,
      dropTables: false,
    },

    // Ensure this doesn't get enabled.
    tsNode: false,
    ...options,
  };

  switch (url.protocol) {
    case "sqlite:": {
      return defineSqliteConfig({
        dbName: url.pathname,
        ...(config as Options<SqliteDriver>),
      });
    }
    case "postgresql:":
    case "postgres:": {
      return definePostgreSqlConfig({
        clientUrl,
        ...(config as Options<PostgreSqlDriver>),
      });
    }
    default: {
      throw new Error(`Unknown database type: ${url.protocol}`);
    }
  }
};
