import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosIdentityCredential } from "./KratosIdentityCredential";
import { KratosIdentityRecoveryAddress } from "./KratosIdentityRecoveryAddress";
import { KratosIdentityVerifiableAddress } from "./KratosIdentityVerifiableAddress";
import { KratosSession } from "./KratosSession";

@Entity({ tableName: "identities" })
export class KratosIdentity extends KratosBaseEntity {
  static readonly modelName = "KratosIdentity";

  @Property({ fieldName: "schema_id", nullable: false })
  public schemaId!: string;

  @Property({ type: "json", nullable: false })
  public traits!: unknown;

  @Property({ nullable: false })
  public state!: string;

  @Property({
    type: "timestamp",
    fieldName: "state_changed_at",
    nullable: true,
  })
  public stateChangedAt?: Date;

  @OneToMany(() => KratosSession, (session) => session.identity)
  sessions = new Collection<KratosSession>(this);

  @OneToMany(() => KratosIdentityCredential, (ic) => ic.identity)
  identityCredentials = new Collection<KratosIdentityCredential>(this);

  @OneToMany(() => KratosIdentityRecoveryAddress, (a) => a.identity)
  recoveryAddresses = new Collection<KratosIdentityRecoveryAddress>(this);

  @OneToMany(() => KratosIdentityVerifiableAddress, (a) => a.identity)
  verifiableAddresses = new Collection<KratosIdentityVerifiableAddress>(this);
}
