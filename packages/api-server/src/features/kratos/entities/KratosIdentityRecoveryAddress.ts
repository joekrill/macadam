import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity.js";
import { KratosIdentity } from "./KratosIdentity.js";
import { KratosIdentityRecoveryToken } from "./KratosIdentityRecoveryToken.js";

@Entity({ tableName: "identity_recovery_addresses" })
export class KratosIdentityRecoveryAddress extends KratosBaseEntity {
  static readonly modelName = "KratosIdentityRecoveryAddress";

  @Property({ nullable: false })
  public via!: string;

  @Property({ nullable: false })
  public value!: string;

  @ManyToOne({
    entity: "KratosIdentity",
    fieldName: "identity_id",
    nullable: false,
  })
  identity!: KratosIdentity;

  @OneToMany(
    () => KratosIdentityRecoveryToken,
    (a) => a.identity_recovery_address,
  )
  recovery_tokens = new Collection<KratosIdentityRecoveryToken>(this);
}
