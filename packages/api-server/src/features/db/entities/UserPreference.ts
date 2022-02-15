import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { AbilityFilter } from "../decorators/AbilityFilter";
import { TimestampedEntity } from "./TimestampedEntity";

@Entity()
@AbilityFilter()
export class UserPreference extends TimestampedEntity {
  @PrimaryKey({ type: "uuid" })
  public id: string;

  @Property({ type: "json", nullable: true })
  public preferences?: unknown;

  constructor(id: string) {
    super();
    this.id = id;
  }
}
