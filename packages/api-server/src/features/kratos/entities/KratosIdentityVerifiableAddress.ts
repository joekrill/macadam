import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosIdentity } from "./KratosIdentity";
import { KratosIdentityVerificationToken } from "./KratosIdentityVerificationToken";

@Entity({ tableName: "identity_verifiable_addresses" })
export class KratosIdentityVerifiableAddress extends KratosBaseEntity {
  static readonly modelName = "KratosIdentityVerifiableAddress";

  @Property({ nullable: false })
  public status!: string;

  @Property({ nullable: false })
  public via!: string;

  @Property({ nullable: false })
  public verified!: boolean;

  @Property({ nullable: false })
  public value!: string;

  @Property({ type: "timestamp", fieldName: "verified_at", nullable: true })
  public verifiedAt?: Date;

  @ManyToOne({
    entity: "KratosIdentity",
    fieldName: "identity_id",
    nullable: false,
  })
  identity!: KratosIdentity;

  @OneToMany(
    () => KratosIdentityVerificationToken,
    (a) => a.identityVerifiableAddress
  )
  verificationTokens = new Collection<KratosIdentityVerificationToken>(this);
}
