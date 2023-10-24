import { Dictionary, FilterQuery, MetadataStorage } from "@mikro-orm/core";
import { FilterDef } from "@mikro-orm/core/typings";
import { AppAbility, AppSubject } from "../../auth/AppAbility.js";

export interface AbilityFilterOptions
  extends Omit<FilterDef, "cond" | "name" | "args"> {
  name?: string;
}

export function AbilityFilter({
  name = "ability",
  default: isDefault = true,
  ...options
}: AbilityFilterOptions = {}) {
  return function <U>(target: U & Dictionary) {
    const meta = MetadataStorage.getMetadataFromDecorator(target);
    meta.filters[name] = {
      ...options,
      name,
      default: isDefault,
      cond: function (args, action) {
        if (!("ability" in args)) {
          throw new Error("'ability' filter param not set!");
        }

        if (args.ability.constructor?.name !== "AppAbility") {
          throw new Error("'ability' filter is not an AppAbility instance!");
        }

        return (args.ability as AppAbility).query(
          action,
          meta.className as AppSubject,
        ) as FilterQuery<U>;
      },
    };

    return target;
  };
}
