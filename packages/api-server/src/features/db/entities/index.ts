import { AuditLog } from "./AuditLog";
import { Thing } from "./Thing";
import { TimestampedEntity } from "./TimestampedEntity";
import { UuidEntity } from "./UuidEntity";

export const entities = [
  AuditLog,
  UuidEntity,
  TimestampedEntity,
  // UserPreference,
  Thing,
] as const;
