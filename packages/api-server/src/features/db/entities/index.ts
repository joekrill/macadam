import { AuditLog } from "./AuditLog.js";
import { ContactUsMessage } from "./ContactUsMessage.js";
import { Thing } from "./Thing.js";
import { TimestampedEntity } from "./TimestampedEntity.js";
import { UuidEntity } from "./UuidEntity.js";

export const entities = [
  AuditLog,
  ContactUsMessage,
  UuidEntity,
  TimestampedEntity,
  // UserPreference,
  Thing,
] as const;
