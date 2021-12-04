import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { KratosIdentityCredential } from "./KratosIdentityCredential";
import { KratosIdentityCredentialIdentifier } from "./KratosIdentityCredentialIdentifier";

@Entity({ tableName: "identity_credential_types" })
export class KratosIdentityCredentialType {
  static readonly modelName = "KratosIdentityCredentialType";

  @PrimaryKey({ type: "uuid" })
  public id!: string;

  @Property({ nullable: false })
  public name!: string;

  @OneToMany(() => KratosIdentityCredential, (ic) => ic.identityCredentialType)
  identityCredentials = new Collection<KratosIdentityCredential>(this);

  @OneToMany(
    () => KratosIdentityCredentialIdentifier,
    (ici) => ici.identityCredentialType
  )
  identityCredentialIdentifiers = new Collection<KratosIdentityCredentialIdentifier>(
    this
  );
}
