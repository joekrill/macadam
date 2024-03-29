import { EntityManager, EntityName, Utils } from "@mikro-orm/core";

const SORTABLE_FIELDS_CACHE: Record<string, string[]> = {};

/**
 * Infers the available sort fields froma a MikroORM entity.
 */
export const entitySortFields = <T>(
  entityName: EntityName<T>,
  entityManager: EntityManager,
) => {
  const className = Utils.className(entityName);
  if (!SORTABLE_FIELDS_CACHE[className]) {
    SORTABLE_FIELDS_CACHE[className] = Array.from(
      entityManager.getMetadata().get(className).propertyOrder.keys(),
    );
  }

  return SORTABLE_FIELDS_CACHE[className] as string[];
};
