import { ormConfig } from "./entities";

/**
 * This file is used to configure MikroORM when it is used via the CLI (`@mikro-orm/cli`)
 */

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable not supplied");
}

export default ormConfig({
  clientUrl: process.env.DB_URL,
  environment: process.env.NODE_ENV || "development",
});
