import { Entity, Property } from "@mikro-orm/core";
import { UuidEntity } from "./UuidEntity";

@Entity()
export class Thing extends UuidEntity {
  static readonly modelName = "Thing";

  @Property({ type: "uuid" })
  public createdBy: string;

  @Property({ type: "uuid" })
  public updatedBy: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description!: string | null;

  @Property()
  public private = true;

  constructor(createdBy: string, name: string, description?: string) {
    super();

    this.createdBy = createdBy;
    this.updatedBy = createdBy;
    this.name = name;
    this.description = description || null;
  }
}
