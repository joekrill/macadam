import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosIdentity } from "./KratosIdentity";
import { KratosIdentityCredentialIdentifier } from "./KratosIdentityCredentialIdentifier";
import { KratosIdentityCredentialType } from "./KratosIdentityCredentialType";

@Entity({ tableName: "identity_credentials" })
export class KratosIdentityCredential extends KratosBaseEntity {
  static readonly modelName = "KratosIdentityCredential";

  @Property({ type: "json", nullable: false })
  public config!: unknown;

  @ManyToOne({
    entity: "KratosIdentity",
    fieldName: "identity_id",
    nullable: false,
  })
  identity!: KratosIdentity;

  @ManyToOne({
    entity: "KratosIdentityCredentialType",
    fieldName: "identity_credential_type_id",
    nullable: false,
  })
  identity_credential_type!: KratosIdentityCredentialType;

  @OneToMany(
    () => KratosIdentityCredentialIdentifier,
    (ici) => ici.identity_credential
  )
  identity_credential_identifiers =
    new Collection<KratosIdentityCredentialIdentifier>(this);
}
