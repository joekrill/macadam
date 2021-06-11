import { Entity, Property } from "@mikro-orm/core";
import { UuidEntity } from "./UuidEntity";

@Entity()
export class Thing extends UuidEntity {
  @Property()
  name!: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
