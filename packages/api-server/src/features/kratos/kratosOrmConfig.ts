import {
  EntityCaseNamingStrategy,
  Options,
  SimpleLogger,
} from "@mikro-orm/core";
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
import { URL } from "url";
import { PinoLogger } from "../db/PinoLogger.js";
import { OrmConfigOptions } from "../db/ormConfig.js";
import { entities } from "./entities/index.js";

export const kratosOrmConfig = ({
  clientUrl,
  environment,
  logger,
  ...options
}: OrmConfigOptions): Options => {
  const url = new URL(clientUrl);

  const config: Options = {
    entities: [...entities],
    debug: environment === "development",
    metadataProvider: TsMorphMetadataProvider,
    highlighter: new SqlHighlighter(),

    // Use `EntityCaseNamingStrategy` so we can maintain parity with the
    // Kratos API, which uses snake-case in most cases. This should allows us
    // to seemlessly transition to the API when the needed endpoints become
    // available.
    namingStrategy: EntityCaseNamingStrategy,

    // the logger property is still needed even though we `loggerFactory` is
    // also specified because it is what is returned when calling `em.get('config')`
    // and is used in some places (i.e. migrations)
    ...(logger ? { logger: (message) => logger.debug(message) } : {}),
    loggerFactory: (loggerOptions) =>
      logger
        ? new PinoLogger({ logger, ...loggerOptions })
        : new SimpleLogger(loggerOptions),

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
