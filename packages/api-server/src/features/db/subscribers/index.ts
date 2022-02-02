import { AuditLogSubscriber } from "./AuditLogSubscriber";
import { TimestampSubscriber } from "./TimestampSubscriber";

export const subscribers = [
  new TimestampSubscriber(),
  new AuditLogSubscriber(),
];
