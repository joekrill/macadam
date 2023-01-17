import { BlobType, Entity, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";

@Entity({ tableName: "courier_messages", abstract: false })
export class KratosCourierMessages extends KratosBaseEntity {
  static readonly modelName = "KratosCourierMessages";

  @Property({ type: "integer", nullable: false })
  public type!: number;

  @Property({ type: "integer", nullable: false })
  public status!: number;

  @Property({ nullable: false })
  public body!: string;

  @Property({ nullable: false })
  public subject!: string;

  @Property({ nullable: false })
  public recipient!: string;

  @Property({ fieldName: "template_type", nullable: false })
  public template_type!: string;

  @Property({
    type: BlobType,
    fieldName: "template_data",
    nullable: true,
  })
  public template_data?: Buffer;
}
