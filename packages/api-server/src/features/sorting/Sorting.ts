import { EntityClass, EntityManager, FlatQueryOrderMap } from "@mikro-orm/core";
import { entitySortFields } from "./entitySortFields.js";
import { sortStringToOrderBy } from "./sortStringToOrderBy.js";

export type SortingOptionsBase = {
  /**
   * The default sort order to use when none is provided.
   */
  sortDefault?: FlatQueryOrderMap;

  /**
   * The name of the query parameter that specifies the sort order.
   */
  sortKey?: string;
};

export type SortingOptionsExplicit = SortingOptionsBase & {
  sortableFields: string[];
};

export type SortingOptionsExtracted<T> = SortingOptionsBase & {
  entityType: EntityClass<T>;
  entityManager: EntityManager;
};

export type SortingOptions<T> =
  | SortingOptionsExplicit
  | SortingOptionsExtracted<T>;

/**
 * Handles extracting sorting options and applying defaults.
 */
export class Sorting<T> {
  static readonly DefaultOptions = {
    sortKey: "sort",
  };

  /**
   * The realized options that were used.
   */
  readonly options: SortingOptionsExplicit;

  /**
   * The `orderBy` value that can be passed to a MikroORM query.
   */
  readonly orderBy?: FlatQueryOrderMap;

  constructor(params: URLSearchParams, options: SortingOptions<T>) {
    let sortableFields: string[];

    if ("sortableFields" in options) {
      sortableFields = options.sortableFields;
    } else {
      sortableFields = entitySortFields(
        options.entityType,
        options.entityManager,
      );
    }

    this.options = {
      sortDefault: options.sortDefault,
      sortKey: options.sortKey,
      sortableFields,
    };

    const sortString = this.options.sortKey
      ? params.get(this.options.sortKey)
      : null;

    this.orderBy =
      sortStringToOrderBy(sortString, this.options.sortableFields) ||
      this.options.sortDefault;
  }
}
