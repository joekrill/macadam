import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosIdentity } from "./KratosIdentity";

@Entity({ tableName: "sessions" })
export class KratosSession extends KratosBaseEntity {
  static readonly modelName = "KratosSession";

  @Property({ type: "timestamp", fieldName: "issued_at", nullable: false })
  public issuedAt!: Date;

  @Property({ type: "timestamp", fieldName: "expires_at", nullable: false })
  public expiresAt!: Date;

  @Property({
    type: "timestamp",
    fieldName: "authenticated_at",
    nullable: false,
  })
  public authenticatedAt!: Date;

  @ManyToOne({
    entity: "KratosIdentity",
    fieldName: "identity_id",
    nullable: false,
  })
  identity!: KratosIdentity;

  @Property({ fieldName: "token", nullable: true })
  public token?: string;

  @Property({
    type: "timestamp",
    fieldName: "authenticated_at",
    nullable: true,
  })
  public active?: boolean;

  @Property({ fieldName: "logout_token", nullable: true })
  public logoutToken?: string;

  @Property({ nullable: false })
  public aal!: string;

  @Property({
    type: "json",
    fieldName: "authentication_methods",
    nullable: false,
  })
  public authenticationMethods!: unknown;
}
