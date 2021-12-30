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
  public used_at?: Date;

  @ManyToOne({
    entity: "KratosIdentityRecoveryAddress",
    fieldName: "identity_recovery_address_id",
    nullable: false,
  })
  identity_recovery_address!: KratosIdentityRecoveryAddress;

  @Property({ fieldName: "selfservice_recovery_flow_id", nullable: true })
  public selfservice_recovery_flow_id?: string;

  @Property({ type: "timestamp", fieldName: "expires_at", nullable: false })
  public expires_at!: Date;

  @Property({ type: "timestamp", fieldName: "issued_at", nullable: false })
  public issued_at!: Date;
}
