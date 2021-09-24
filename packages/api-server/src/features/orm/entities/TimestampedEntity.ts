import { Property } from "@mikro-orm/core";

export abstract class TimestampedEntity {
  @Property()
  public createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  public updatedAt: Date = new Date();
}
