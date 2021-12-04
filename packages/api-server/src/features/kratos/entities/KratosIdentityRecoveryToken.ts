import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosIdentityRecoveryAddress } from "./KratosIdentityRecoveryAddress";

@Entity({ tableName: "identity_recovery_tokens" })
export class KratosIdentityRecoveryToken extends KratosBaseEntity {
  static readonly modelName = "KratosIdentityRecoveryToken";

  @Property({ nullable: false })
  public token!: string;

  @Property({ nullable: false })
  public used!: boolean;

  @Property({ type: "timestamp", fieldName: "used_at", nullable: true })
  public usedAt?: Date;

  @ManyToOne({
    entity: "KratosIdentityRecoveryAddress",
    fieldName: "identity_recovery_address_id",
    nullable: false,
  })
  identityRecoveryAddress!: KratosIdentityRecoveryAddress;

  @Property({ fieldName: "selfservice_recovery_flow_id", nullable: true })
  public selfserviceRecoveryFlowId?: string;

  @Property({ type: "timestamp", fieldName: "expires_at", nullable: false })
  public expiresAt!: Date;

  @Property({ type: "timestamp", fieldName: "issued_at", nullable: false })
  public issuedAt!: Date;
}
