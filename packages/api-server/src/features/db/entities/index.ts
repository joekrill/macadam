import { Thing } from "./Thing";
import { TimestampedEntity } from "./TimestampedEntity";
import { UserPreference } from "./UserPreference";
import { UuidEntity } from "./UuidEntity";

export const entities = [
  UuidEntity,
  TimestampedEntity,
  UserPreference,
  Thing,
] as const;
