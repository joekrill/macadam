import assert from "assert";
import pino from "pino";

export const logger = pino(
  { serializers: pino.stdSerializers },
  pino.destination({ sync: false }),
);

export const levels = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

// Sanity check to make sure that `lavels` contains all default pino levels
assert.deepEqual(
  Object.keys(logger.levels.values).sort(),
  [...levels].sort(),
  "Mismatch pino levels. Please fix `levels` to match the actual level names specific by pino",
);
