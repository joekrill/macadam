import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosIdentityVerifiableAddress } from "./KratosIdentityVerifiableAddress";

@Entity({ tableName: "identity_verification_tokens" })
export class KratosIdentityVerificationToken extends KratosBaseEntity {
  static readonly modelName = "KratosIdentityVerificationToken";

  @Property({ nullable: false })
  public token!: string;

  @Property({ nullable: false })
  public used!: boolean;

  @Property({ type: "timestamp", fieldName: "used_at", nullable: true })
  public used_at?: Date;

  @Property({ type: "timestamp", fieldName: "expires_at", nullable: false })
  public expires_at!: Date;

  @Property({ type: "timestamp", fieldName: "issued_at", nullable: false })
  public issued_at!: Date;

  @ManyToOne({
    entity: "KratosIdentityVerifiableAddress",
    fieldName: "identity_verifiable_address_id",
    nullable: false,
  })
  identity_verifiable_address!: KratosIdentityVerifiableAddress;

  @Property({ nullable: true, fieldName: "selfservice_recovery_flow_id" })
  public selfservice_recovery_flow_id?: string;
}
