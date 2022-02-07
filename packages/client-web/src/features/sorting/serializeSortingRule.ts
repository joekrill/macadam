import { SortingRule } from "react-table";

/**
 * Serializes an array of SortingRule values to a string that can then be
 * used as a URL query string value and sent to the API server.
 */
export const serializeSortingRules = <D>(...rules: SortingRule<D>[]) =>
  rules.map(({ id, desc }) => `${desc ? "-" : ""}${id}`).join(",");
