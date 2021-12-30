import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosIdentityCredential } from "./KratosIdentityCredential";
import { KratosIdentityCredentialType } from "./KratosIdentityCredentialType";

@Entity({ tableName: "identity_credential_identifiers" })
export class KratosIdentityCredentialIdentifier extends KratosBaseEntity {
  static readonly modelName = "KratosIdentityCredentialIdentifier";

  @Property({ fieldName: "identifier", nullable: false })
  public identifier!: string;

  @ManyToOne({
    entity: "KratosIdentityCredential",
    fieldName: "identity_credential_id",
    nullable: false,
  })
  identity_credential!: KratosIdentityCredential;

  @ManyToOne({
    entity: "KratosIdentityCredentialType",
    fieldName: "identity_credential_type_id",
    nullable: false,
  })
  identity_credential_type!: KratosIdentityCredentialType;
}
