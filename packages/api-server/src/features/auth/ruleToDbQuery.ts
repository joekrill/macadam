import { RuleToQueryConverter } from "@casl/ability/extra";
import deepMapKeys from "deep-map-keys";
import { AppAbility } from "./AppAbility.js";

/**
 *
 * This is used to convert Casl rule conditions to a database query condition
 * that can be passed to MikroORM.
 *
 * TODO: MikroORM supports _most_ of the same query conditions as Casl, so most
 * conversions should "just work", except for the following:
 * - $all
 * - $size
 * - $exists
 * - $elemMatch
 *
 * `$regex` in Casl is mapped to `$re` in MikroORM. This is implemented.
 *
 * entirely clear
 * - https://mikro-orm.io/docs/query-conditions
 * - https://casl.js.org/v5/en/guide/conditions-in-depth
 * - https://casl.js.org/v5/en/api/casl-ability-extra#rules-to-query
 */
export const ruleToDbQuery: RuleToQueryConverter<AppAbility> = (rule) =>
  deepMapKeys(rule.conditions || {}, (key) => (key === "$regex" ? "$re" : key));
