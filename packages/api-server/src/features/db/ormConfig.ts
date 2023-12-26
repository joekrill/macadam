import { Options, SimpleLogger } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import pino from "pino";
import { URL } from "url";
import { PinoLogger } from "./PinoLogger.js";
import { entities } from "./entities/index.js";
import { subscribers } from "./subscribers/index.js";

export interface OrmConfigOptions
  extends Omit<Partial<Options<PostgreSqlDriver>>, "logger"> {
  clientUrl: string;
  environment: string;
  logger?: pino.Logger<string>;
}

export const ormConfig = ({
  clientUrl,
  environment,
  logger,
  ...options
}: OrmConfigOptions): Options<PostgreSqlDriver> => {
  const url = new URL(clientUrl);

  const migrationsPath = "./build/features/db/migrations";
  const migrationspathTs = "./src/features/db/migrations";

  return {
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

    // SQLite is supported using something like `sqlite:/absolute/path/db.sqlite`
    // or `sqlite:relative/path/db.sqlite`
    ...(url.protocol === "sqlite:"
      ? {
          type: "sqlite",
          dbName: url.pathname,
        }
      : {}),

    // For postgres, the only thing needed is the complete connection URL
    ...(url.protocol === "postgresql:" || url.protocol === "postgres:"
      ? {
          type: "postgresql",
          clientUrl,
        }
      : {}),

    ...options,
  };
};
