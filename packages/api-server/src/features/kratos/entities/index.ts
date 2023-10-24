import { KratosBaseEntity } from "./KratosBaseEntity.js";
import { KratosCourierMessages } from "./KratosCourierMessages.js";
import { KratosIdentity } from "./KratosIdentity.js";
import { KratosIdentityCredential } from "./KratosIdentityCredential.js";
import { KratosIdentityCredentialIdentifier } from "./KratosIdentityCredentialIdentifier.js";
import { KratosIdentityCredentialType } from "./KratosIdentityCredentialType.js";
import { KratosIdentityRecoveryAddress } from "./KratosIdentityRecoveryAddress.js";
import { KratosIdentityRecoveryToken } from "./KratosIdentityRecoveryToken.js";
import { KratosIdentityVerifiableAddress } from "./KratosIdentityVerifiableAddress.js";
import { KratosIdentityVerificationToken } from "./KratosIdentityVerificationToken.js";
import { KratosSession } from "./KratosSession.js";

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
