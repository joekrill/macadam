import {
  Ability,
  AbilityBuilder,
  AbilityTuple,
  CanParameters,
  ExtractSubjectType,
  InferSubjects,
} from "@casl/ability";
import { rulesToQuery } from "@casl/ability/extra";
import { Session } from "@ory/kratos-client";
import { entities as dbEntities } from "../db/entities";
import { entities as kratosEntities } from "../kratos/entities";
import { ruleToDbQuery } from "./ruleToDbQuery";

const entities = [...dbEntities, ...kratosEntities] as const;

export type AppSubject = InferSubjects<typeof entities[number], true>;

export type AppAction = "create" | "read" | "update" | "delete" | "manage";

export type AppAbilityTuple = AbilityTuple<AppAction, AppSubject>;

export class AppAbility extends Ability<AppAbilityTuple> {
  query(...[action, subject, _fields]: CanParameters<AppAbilityTuple>) {
    // I'm not sure why the `subject` type does not seem to be valid unless
    // explicitly cast. It's difficult to even follow the underlying type
    // defintion. But any subject should be valid here and not cause an error.
    return rulesToQuery(
      this,
      action,
      subject as ExtractSubjectType<Parameters<this["rulesFor"]>[1]>,
      ruleToDbQuery
    );
  }
}

export const abilityFor = (session?: Session) => {
  const builder = new AbilityBuilder(AppAbility);

  // NOTE: All conditions must either:
  // 1. be valid MikroORM queries,
  // 2. have an appropriate conversion in `ruleToDbQuery` that allows
  // them to be used with MikroORM!
  if (session) {
    // Users can read their own sessions.
    builder.can("read", "KratosSession", { identity_id: session.identity.id });
  }

  return builder.build();
};
