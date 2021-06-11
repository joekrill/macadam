import { ormConfig } from "./config";

/**
 * This file is used to configure MikroORM when it is used via the
 * `@mikro-orm/cli` CLI tool.
 */

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable not supplied");
}

export default ormConfig({
  clientUrl: process.env.DB_URL,
  environment: process.env.NODE_ENV || "development",
});
