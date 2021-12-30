import { PrimaryKey, Property } from "@mikro-orm/core";

export abstract class KratosBaseEntity {
  @PrimaryKey({ type: "uuid", nullable: false })
  public id!: string;

  @Property({ type: "timestamp", fieldName: "created_at", nullable: false })
  public created_at!: Date;

  @Property({ type: "timestamp", fieldName: "updated_at", nullable: false })
  public updated_at!: Date;

  @Property({ type: "uuid", nullable: true })
  public nid?: string;
}
