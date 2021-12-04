import { PrimaryKey, Property } from "@mikro-orm/core";

export abstract class KratosBaseEntity {
  @PrimaryKey({ type: "uuid", nullable: false })
  public id!: string;

  @Property({ type: "timestamp", fieldName: "created_at", nullable: false })
  public createdAt!: Date;

  @Property({ type: "timestamp", fieldName: "updated_at", nullable: false })
  public updatedAt!: Date;

  @Property({ type: "uuid", nullable: true })
  public nid?: string;
}
