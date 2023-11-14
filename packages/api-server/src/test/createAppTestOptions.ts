import pino from "pino";
import { AppOptions } from "../app";

export const createAppTestOptions: AppOptions = {
  environment: "test",
  dbUrl: "sqlite::memory:",
  logger: pino({ enabled: false }),
  kratos: {
    publicUrl: "",
    clientUrl: "sqlite::memory:",
  },
};
