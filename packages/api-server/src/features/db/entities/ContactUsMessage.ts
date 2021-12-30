import { Entity, Property } from "@mikro-orm/core";
import { UuidEntity } from "./UuidEntity";

export enum ContactUsMessageStatus {
  SENT = "sent",
  ERROR = "error",
}

@Entity()
export class ContactUsMessage extends UuidEntity {
  static readonly modelName = "ContactUsMessage";

  @Property({ type: "uuid" })
  public sentBy?: string;

  @Property()
  public ipAddress!: string;

  @Property()
  public userAgent!: string;

  @Property()
  public name!: string;

  @Property()
  public from!: string;

  @Property({ nullable: true })
  public message!: string | null;

  @Property()
  public lastStatusAt?: Date;

  @Property()
  public status?: string;

  @Property()
  public error?: string;

  constructor(
    name: string,
    from: string,
    message: string,
    ipAddress: string,
    userAgent: string,
    sentBy?: string
  ) {
    super();

    this.name = name;
    this.from = from;
    this.message = message;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.sentBy = sentBy;
  }
}
