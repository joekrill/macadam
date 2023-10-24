import { entities as kratosEntites } from "../kratos/entities/index.js";
import { entities } from "./entities/index.js";
import { ormConfig } from "./ormConfig.js";

/**
 * This file is used to configure MikroORM when it is used via the
 * `@mikro-orm/cli` CLI tool.
 */

if (!process.env.DB_URL) {
  console.warn(
    "DB_URL environment variable not supplied! Using in-memory sqlite.",
  );
}

export default ormConfig({
  entities: [...entities, ...kratosEntites],
  clientUrl: process.env.DB_URL || "sqlite::memory:",
  environment: process.env.NODE_ENV || "development",
});
