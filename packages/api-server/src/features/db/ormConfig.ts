import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import pino from "pino";
import { URL } from "url";
import { entities } from "./entities";
import { AuditLogSubscriber } from "./subscribers/AuditLogSubscriber";

export interface OrmConfigOptions {
  environment: string;
  clientUrl: string;
  logger?: pino.Logger;
}

export const ormConfig = ({
  clientUrl,
  environment,
  logger,
}: OrmConfigOptions): Options<PostgreSqlDriver> => {
  const url = new URL(clientUrl);
  const ormLogger = logger?.child({});

  return {
    entities: [...entities],
    subscribers: [new AuditLogSubscriber()],
    debug: environment === "development",
    ...(ormLogger ? { logger: (message) => ormLogger.debug(message) } : {}),
    migrations: {
      path: "./src/features/db/migrations",
      tableName: "migrations",
      transactional: true,
      safe: true,
      emit: "ts",
      allOrNothing: true,
      // snapshot: true,
    },

    // When using the CLI,
    tsNode: environment === "development",

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
