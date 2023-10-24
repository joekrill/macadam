import { ParsedField, parseField } from "./parseField.js";

/**
 * Parse a string that specifies zero or more sorting fields and directions.
 * i.e. "+createdAt,-name,id" (sort by created at in ascending order, then
 * name in descending order, then id in asencding order).
 */
export const parseSortString = (
  value: string | null | undefined,
): ParsedField[] => {
  if (!value) {
    return [];
  }

  return value.split(",").map((field) => parseField(field.trim()));
};
