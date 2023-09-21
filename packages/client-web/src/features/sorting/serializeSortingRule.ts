import { SortingState } from "@tanstack/react-table";

/**
 * Serializes an array of SortingRule values to a string that can then be
 * used as a URL query string value and sent to the API server.
 */
export const serializeSortingRules = (...rules: SortingState) =>
  rules.map(({ id, desc }) => `${desc ? "-" : ""}${id}`).join(",");
