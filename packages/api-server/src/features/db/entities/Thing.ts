import { Entity, Filter, OptionalProps, Property } from "@mikro-orm/core";
import { AbilityFilter } from "../decorators/AbilityFilter.js";
import { TextSearchFilter } from "../decorators/TextSearchFilter.js";
import { UuidEntity } from "./UuidEntity.js";

@Entity()
@AbilityFilter()
@TextSearchFilter({ name: "search", columns: ["name", "description"] })
@Filter({ name: "notDeleted", cond: { deletedAt: null }, default: true })
export class Thing extends UuidEntity {
  static readonly modelName = "Thing";

  [OptionalProps]?: "createdAt" | "updatedAt" | "createdBy" | "updatedBy";

  @Property({ type: "uuid" })
  public createdBy: string;

  @Property({ type: "uuid" })
  public updatedBy: string;

  @Property()
  public name!: string;

  @Property({ nullable: true })
  public description?: string | null;

  @Property({ default: true })
  public isPublic = false;

  @Property()
  public deletedAt?: Date;

  constructor(createdBy: string, name: string, description?: string) {
    super();

    this.createdBy = createdBy;
    this.updatedBy = createdBy;
    this.name = name;
    this.description = description;
  }
}
