import { ColumnSort } from "@tanstack/react-table";
import { parseSortingRule } from "./parseSortingRule";

/**
 * Parses a sort string, usually used as a URL parameter, into an array
 * of `SortingRule`s
 */
export const parseSortingRules = (rulesString: string): ColumnSort[] =>
  rulesString.split(",").map((ruleString) => parseSortingRule(ruleString));
