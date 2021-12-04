import { KratosBaseEntity } from "./KratosBaseEntity";
import { KratosCourierMessages } from "./KratosCourierMessages";
import { KratosIdentity } from "./KratosIdentity";
import { KratosIdentityCredential } from "./KratosIdentityCredential";
import { KratosIdentityCredentialIdentifier } from "./KratosIdentityCredentialIdentifier";
import { KratosIdentityCredentialType } from "./KratosIdentityCredentialType";
import { KratosIdentityRecoveryAddress } from "./KratosIdentityRecoveryAddress";
import { KratosIdentityRecoveryToken } from "./KratosIdentityRecoveryToken";
import { KratosIdentityVerifiableAddress } from "./KratosIdentityVerifiableAddress";
import { KratosIdentityVerificationToken } from "./KratosIdentityVerificationToken";
import { KratosSession } from "./KratosSession";

export const entities = [
  KratosBaseEntity,
  KratosCourierMessages,
  KratosIdentity,
  KratosIdentityCredential,
  KratosIdentityCredentialIdentifier,
  KratosIdentityCredentialType,
  KratosIdentityRecoveryAddress,
  KratosIdentityRecoveryToken,
  KratosIdentityVerifiableAddress,
  KratosIdentityVerificationToken,
  KratosSession,
] as const;
