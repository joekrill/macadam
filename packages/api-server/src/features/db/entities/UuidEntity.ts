import { PrimaryKey } from "@mikro-orm/core";
import { v4 } from "uuid";
import { TimestampedEntity } from "./TimestampedEntity.js";

export abstract class UuidEntity extends TimestampedEntity {
  @PrimaryKey({ type: "uuid" })
  public id: string = v4();
}
