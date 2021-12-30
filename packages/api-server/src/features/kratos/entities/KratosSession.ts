import { Entity, Filter, ManyToOne, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosIdentity } from "./KratosIdentity";

@Entity({ tableName: "sessions" })
@Filter({ name: "active", cond: { active: true }, default: true })
export class KratosSession extends KratosBaseEntity {
  static readonly modelName = "KratosSession";

  @Property({ type: "timestamp", fieldName: "issued_at", nullable: false })
  public issued_at!: Date;

  @Property({ type: "timestamp", fieldName: "expires_at", nullable: false })
  public expires_at!: Date;

  @Property({
    type: "timestamp",
    fieldName: "authenticated_at",
    nullable: false,
  })
  public authenticated_at!: Date;

  @Property()
  public identity_id!: string;

  @ManyToOne({
    entity: "KratosIdentity",
    nullable: false,
  })
  identity!: KratosIdentity;

  @Property({ fieldName: "token", nullable: true })
  public token?: string;

  @Property()
  public active?: boolean;

  @Property({ fieldName: "logout_token", nullable: true })
  public logout_token?: string;

  @Property({ nullable: false, fieldName: "aal" })
  public authenticator_assurance_level!: string;

  @Property({
    type: "json",
    fieldName: "authentication_methods",
    nullable: false,
  })
  public authentication_methods!: unknown;
}
