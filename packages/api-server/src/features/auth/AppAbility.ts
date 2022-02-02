import {
  Ability,
  AbilityTuple,
  CanParameters,
  ExtractSubjectType,
  InferSubjects,
  subject as identifySubject,
} from "@casl/ability";
import { rulesToQuery } from "@casl/ability/extra";
import { Utils } from "@mikro-orm/core";
import { Forbidden } from "http-errors";
import { entities as dbEntities } from "../db/entities";
import { entities as kratosEntities } from "../kratos/entities";
import { ruleToDbQuery } from "./ruleToDbQuery";

const entities = [...dbEntities, ...kratosEntities] as const;

export type AppSubject = InferSubjects<typeof entities[number], true>;

export type AppAction = "create" | "read" | "update" | "delete" | "manage";

export type AppAbilityTuple = AbilityTuple<AppAction, AppSubject>;

export class AppAbility extends Ability<AppAbilityTuple> {
  /**
   * Returns a query that can be used as a MikroORM where clause to filter
   * only those subjects that are permitted for the given action.
   */
  query(...[action, subject, _fields]: CanParameters<AppAbilityTuple>) {
    // I'm not sure why the `subject` type does not seem to be valid unless
    // explicitly cast. It's difficult to even follow the underlying type
    // defintion. But any subject should be valid here and not cause an error.
    const result = rulesToQuery(
      this,
      action,
      subject as ExtractSubjectType<Parameters<this["rulesFor"]>[1]>,
      ruleToDbQuery
    );

    if (result === null) {
      throw new Forbidden();
    }

    return result;
  }

  relevantRuleFor(...args: CanParameters<AppAbilityTuple>) {
    const [action, subject, ...rest] = args;

    // If `subject` is a MikroORM model instance, we want to call toJSON on it
    // otherwise certain conditions will not work correctly (in particular,
    // those that check values of underlying collection -- those need to
    // return true when Array.isArray is called on them, which will not happen
    // when they are Collection<> instances).

    if (Utils.isEntity(subject)) {
      return super.relevantRuleFor(
        action,
        identifySubject(subject.constructor.name, subject.toJSON()),
        ...rest
      );
    }

    return super.relevantRuleFor(action, subject, ...rest);
  }

  detectSubjectType(subject?: AppSubject) {
    if (Utils.isEntity(subject)) {
      return (
        (subject.constructor.name as ExtractSubjectType<AppSubject>) ||
        super.detectSubjectType(subject)
      );
    }

    return super.detectSubjectType(subject);
  }

  /**
   * Checks if a user has the ability to perform an action, otherwise
   * throws a Forbidden error.
   */
  ensureCan(...args: CanParameters<AppAbilityTuple>) {
    if (!this.can(...args)) {
      throw new Forbidden();
    }
  }
}
