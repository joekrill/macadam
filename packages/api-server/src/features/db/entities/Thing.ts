import { Entity, Filter, Property } from "@mikro-orm/core";
import { UuidEntity } from "./UuidEntity";

@Entity()
@Filter({ name: "notDeleted", cond: { deletedAt: null }, default: true })
export class Thing extends UuidEntity {
  static readonly modelName = "Thing";

  @Property({ type: "uuid" })
  public createdBy: string;

  @Property({ type: "uuid" })
  public updatedBy: string;

  @Property()
  public name!: string;

  @Property({ nullable: true })
  public description!: string | null;

  @Property({ default: true })
  public isPublic: boolean = false;

  @Property()
  public deletedAt?: Date;

  constructor(createdBy: string, name: string, description?: string) {
    super();

    this.createdBy = createdBy;
    this.updatedBy = createdBy;
    this.name = name;
    this.description = description || null;
  }
}
