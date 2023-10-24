import { AuditLogSubscriber } from "./AuditLogSubscriber.js";
import { TimestampSubscriber } from "./TimestampSubscriber.js";

export const subscribers = [
  new TimestampSubscriber(),
  new AuditLogSubscriber(),
];
