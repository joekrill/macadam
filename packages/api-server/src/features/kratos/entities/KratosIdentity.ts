import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity.js";
import { KratosIdentityCredential } from "./KratosIdentityCredential.js";
import { KratosIdentityRecoveryAddress } from "./KratosIdentityRecoveryAddress.js";
import { KratosIdentityVerifiableAddress } from "./KratosIdentityVerifiableAddress.js";
import { KratosSession } from "./KratosSession.js";

@Entity({ tableName: "identities" })
export class KratosIdentity extends KratosBaseEntity {
  static readonly modelName = "KratosIdentity";

  @Property({ fieldName: "schema_id", nullable: false })
  public schema_id!: string;

  @Property({ type: "json", nullable: false })
  public traits!: unknown;

  @Property({ nullable: false })
  public state!: string;

  @Property({
    type: "timestamp",
    fieldName: "state_changed_at",
    nullable: true,
  })
  public state_changed_at?: Date;

  @OneToMany(() => KratosSession, (session) => session.identity)
  sessions = new Collection<KratosSession>(this);

  @OneToMany(() => KratosIdentityCredential, (ic) => ic.identity)
  identity_credentials = new Collection<KratosIdentityCredential>(this);

  @OneToMany(() => KratosIdentityRecoveryAddress, (a) => a.identity)
  recovery_addresses = new Collection<KratosIdentityRecoveryAddress>(this);

  @OneToMany(() => KratosIdentityVerifiableAddress, (a) => a.identity)
  verifiable_addresses = new Collection<KratosIdentityVerifiableAddress>(this);
}
