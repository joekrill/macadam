import {
  AnyEntity,
  ChangeSet,
  Entity,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class AuditLog {
  static readonly modelName = "AuditLog";

  @PrimaryKey({ type: "uuid" })
  public id: string = v4();

  @Property()
  public createdAt: Date = new Date();

  @Property({ type: "uuid", nullable: true })
  public userId?: string;

  @Property()
  public entityType: string;

  @Property()
  public entityId: string;

  @Property()
  public action: string; // create, update, delete

  @Property({ type: "json", nullable: true })
  public context?: unknown;

  @Property({ type: "json", nullable: true })
  public changes?: unknown;

  @Property({ type: "json", nullable: true })
  public before?: unknown;

  @Property({ type: "json", nullable: true })
  public after?: unknown;

  constructor(changeSet: ChangeSet<AnyEntity<unknown>>) {
    this.entityType = changeSet.name;
    this.entityId = String(changeSet.getPrimaryKey());
    this.action = changeSet.type;
    this.changes = changeSet.payload;
    this.before = changeSet.originalEntity;
    this.after = changeSet.entity;
  }
}
