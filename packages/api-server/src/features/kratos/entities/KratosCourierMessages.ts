import { BlobType, Entity, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";

@Entity({ tableName: "courier_messages", abstract: false })
export class KratosCourierMessages extends KratosBaseEntity {
  constructor() {
    super();
  }

  static readonly modelName = "KratosCourierMessages";

  @Property({ type: "integer", nullable: false })
  public type!: Number;

  @Property({ type: "integer", nullable: false })
  public status!: Number;

  @Property({ nullable: false })
  public body!: string;

  @Property({ nullable: false })
  public subject!: string;

  @Property({ nullable: false })
  public recipient!: string;

  @Property({ fieldName: "template_type", nullable: false })
  public templateType!: String;

  @Property({
    type: BlobType,
    fieldName: "template_data",
    nullable: true,
  })
  public templateData?: Buffer;
}
