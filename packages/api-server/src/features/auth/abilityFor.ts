import { AbilityBuilder } from "@casl/ability";
import { Session } from "@ory/kratos-client";
import { AppAbility } from "./AppAbility";

/**
 * Gets an AppAbility based on a particular session.
 */
export const abilityFor = (session?: Session) => {
  const builder = new AbilityBuilder(AppAbility);

  builder.can("read", "Thing", { private: false });

  // NOTE: All conditions must either:
  // 1. be valid MikroORM queries,
  // 2. have an appropriate conversion in `ruleToDbQuery` that allows
  // them to be used with MikroORM!
  if (session) {
    const userId = session.identity.id;

    // Users can read their own sessions.
    builder.can("read", "KratosSession", { identity_id: userId });

    builder.can("create", "Thing");
    builder.can("read", "Thing");
    builder.can(["read", "update", "delete"], "Thing", { createdBy: userId });
  } else {
  }

  return builder.build();
};
