import { RuleToQueryConverter } from "@casl/ability/extra";
import { AppAbility } from "./abilities";

// TODO: Implement this so it converts MongoQuery's to appropriate filters for MikroOrm
// At the moment this simply passes through the conditions supplied when defining
// abilities. So as long as those conditions are valid queries for use with MikroORM,
// they will work correctly.
export const ruleToDbQuery: RuleToQueryConverter<AppAbility> = (rule) =>
  rule.conditions || {};
