import { AbilityBuilder } from "@casl/ability";
import { Session } from "@ory/kratos-client";
import { AppAbility } from "./AppAbility";

/**
 * Gets an AppAbility based on a particular session.
 */
export const abilityFor = (session?: Session) => {
  const builder = new AbilityBuilder(AppAbility);

  // NOTE: All conditions must either:
  // 1. be valid MikroORM queries,
  // 2. have an appropriate conversion in `ruleToDbQuery` that allows
  // them to be used with MikroORM!

  builder.can("create", "ContactUsMessage");
  builder.can("read", "Thing", { isPublic: true });

  if (session) {
    const userId = session.identity.id;
    const isVerified =
      session.identity.verifiable_addresses?.some(({ verified }) => verified) ||
      false;

    // Users can read and delete ("") their own sessions.
    builder.can(["read", "delete"], "KratosSession", { identity_id: userId });
    builder.can(["read", "update", "delete"], "Thing", { createdBy: userId });

    if (isVerified) {
      builder.can("create", "Thing");
    }
  }

  return builder.build();
};
