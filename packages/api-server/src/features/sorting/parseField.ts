export type OrderPrefix = "+" | "-" | "";

export interface ParsedField {
  prefix?: OrderPrefix;
  field: string;
  fieldLower: string;
}

/**
 * Parses a single sort field in the form of `<?prefix><field>` where
 * prefix is an optional "+" (ascending) or "-" (descending) and the field
 * is the name of the field to be sorted on.
 */
export const parseField = (field: string): ParsedField => {
  const trimmed = field.trim();
  const prefix = trimmed.charAt(0);

  if (prefix === "-" || prefix === "+") {
    const fieldName = trimmed.substring(1);
    return { prefix, field: fieldName, fieldLower: fieldName.toLowerCase() };
  }

  return {
    field: trimmed,
    fieldLower: trimmed.toLowerCase(),
  };
};
