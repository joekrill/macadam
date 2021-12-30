import { AuditLog } from "./AuditLog";
import { ContactUsMessage } from "./ContactUsMessage";
import { Thing } from "./Thing";
import { TimestampedEntity } from "./TimestampedEntity";
import { UuidEntity } from "./UuidEntity";

export const entities = [
  AuditLog,
  ContactUsMessage,
  UuidEntity,
  TimestampedEntity,
  // UserPreference,
  Thing,
] as const;
