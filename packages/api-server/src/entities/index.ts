import { Options } from "@mikro-orm/core";
import { URL } from "url";
import { Thing } from "./Thing";
import { UuidEntity } from "./UuidEntity";

export const entities = [UuidEntity, Thing];

export interface OrmConfigOptions {
  environment: string;
  clientUrl: string;
}

export const ormConfig = ({
  environment,
  clientUrl,
}: OrmConfigOptions): Options => {
  const url = new URL(clientUrl);

  return {
    entities,
    migrations: {
      path: "./src/migrations",
      tableName: "migrations",
      transactional: true,
      safe: true,
      emit: "ts",
      allOrNothing: true,
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
