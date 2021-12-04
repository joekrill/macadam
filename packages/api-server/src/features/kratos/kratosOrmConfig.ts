import { Options } from "@mikro-orm/core";
import { URL } from "url";
import { OrmConfigOptions } from "../db/ormConfig";
import { entities } from "./entities";

export const kratosOrmConfig = ({
  clientUrl,
  environment,
  logger,
}: OrmConfigOptions): Options => {
  const url = new URL(clientUrl);
  const ormLogger = logger?.child({});

  return {
    entities: [...entities],
    debug: environment === "development",
    ...(ormLogger ? { logger: (message) => ormLogger.debug(message) } : {}),

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
  };
};
