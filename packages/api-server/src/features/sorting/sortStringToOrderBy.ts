import { FlatQueryOrderMap, QueryOrder } from "@mikro-orm/core";
import { parseSortString } from "./parseSortString";
import { validateFields } from "./validateFields";

export const sortStringToOrderBy = (
  param: string | null,
  validFields: string[],
) => {
  if (!param) {
    return undefined;
  }

  const fields = parseSortString(param);
  const validatedFields = validateFields(fields, validFields);

  if (validatedFields.length === 0) {
    return undefined;
  }

  return validatedFields.reduce((map, { field, prefix }) => {
    map[field] = prefix === "-" ? QueryOrder.DESC : QueryOrder.ASC;
    return map;
  }, {} as FlatQueryOrderMap);
};
