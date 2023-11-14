import {
  EntityCaseNamingStrategy,
  Options,
  SimpleLogger,
} from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
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
  const ormLogger = logger?.child({ db: "kratos" });

  return {
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
    ...(ormLogger ? { logger: (message) => ormLogger.debug(message) } : {}),
    loggerFactory: (loggerOptions) =>
      ormLogger
        ? new PinoLogger({ logger: ormLogger, ...loggerOptions })
        : new SimpleLogger(loggerOptions),

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
