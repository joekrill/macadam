import { ParsedField } from "./parseField";

/**
 * Filters an array of `ParsedField`'s ensuring that the `field`
 * property uses the correct casing and removes any invalid fields.
 */
export const validateFields = (
  fields: ParsedField[],
  validFields: string[]
) => {
  const lowerCasedFields = validFields.map((field) => field.toLowerCase());

  return fields
    .map((field) => {
      if (validFields.includes(field.field)) {
        return field;
      }

      // Check for a valid field that may not match the correct casing.
      const index = lowerCasedFields.indexOf(field.fieldLower);
      if (index >= 0) {
        return {
          ...field,
          field: validFields[index],
        };
      }

      return undefined;
    })
    .filter((field) => !!field) as ParsedField[];
};
