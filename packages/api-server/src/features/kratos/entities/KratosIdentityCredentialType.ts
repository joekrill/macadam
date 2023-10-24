import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { KratosIdentityCredential } from "./KratosIdentityCredential.js";
import { KratosIdentityCredentialIdentifier } from "./KratosIdentityCredentialIdentifier.js";

@Entity({ tableName: "identity_credential_types" })
export class KratosIdentityCredentialType {
  static readonly modelName = "KratosIdentityCredentialType";

  @PrimaryKey({ type: "uuid" })
  public id!: string;

  @Property({ nullable: false })
  public name!: string;

  @OneToMany(
    () => KratosIdentityCredential,
    (ic) => ic.identity_credential_type,
  )
  identity_credentials = new Collection<KratosIdentityCredential>(this);

  @OneToMany(
    () => KratosIdentityCredentialIdentifier,
    (ici) => ici.identity_credential_type,
  )
  identity_credential_identifiers =
    new Collection<KratosIdentityCredentialIdentifier>(this);
}
