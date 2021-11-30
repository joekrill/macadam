import { Entity, Property } from "@mikro-orm/core";
import { UuidEntity } from "./UuidEntity";

@Entity()
export class Thing extends UuidEntity {
  @Property({ type: "uuid" })
  public createdBy: string;

  @Property()
  name!: string;

  constructor(createdBy: string, name: string) {
    super();

    this.createdBy = createdBy;
    this.name = name;
  }
}
