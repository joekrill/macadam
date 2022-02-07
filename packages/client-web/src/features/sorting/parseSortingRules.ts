import { SortingRule } from "react-table";
import { parseSortingRule } from "./parseSortingRule";

/**
 * Parses a sort string, usually used as a URL parameter, into an array
 * of `SortingRule`s
 */
export const parseSortingRules = <D>(rulesString: string): SortingRule<D>[] =>
  rulesString.split(",").map((ruleString) => parseSortingRule(ruleString));
