import { Dictionary, MetadataStorage } from "@mikro-orm/core";
import { FilterDef } from "@mikro-orm/core/typings";
import { SqlEntityManager } from "@mikro-orm/postgresql";

const PARSER_FUNCTIONS = {
  websearch: "websearch_to_tsquery",
  phrase: "phraseto_tsquery",
  plain: "plainto_tsquery",
  none: "to_tsquery",
};

export type TextSearchParser = keyof typeof PARSER_FUNCTIONS;

export interface TextSearchFilterOptions
  extends Omit<FilterDef, "cond" | "name" | "args"> {
  idColumn?: string;
  name?: string;
  columns: string[];
  parser?: TextSearchParser;
}

export function TextSearchFilter({
  idColumn = "id",
  columns,
  parser = "websearch",
  name = "search",
  ...options
}: TextSearchFilterOptions) {
  return function <U>(target: U & Dictionary) {
    const meta = MetadataStorage.getMetadataFromDecorator(target);
    meta.filters[name] = {
      ...options,
      name,
      cond: (args, action, em: SqlEntityManager) => {
        const { query } = args as { query: string };

        if (typeof query !== "string" || query.trim() === "") {
          return {};
        }

        const driverType = em.config.get("type");
        if (driverType !== "postgresql") {
          // TODO: implement support for sqlite, etc?
          return {};
        }

        const qb = em.createQueryBuilder(meta.className, "ts0");
        const columnsRaw = columns
          .map((column) => qb.raw(`${qb.alias}.${column}`))
          .join(" || ' ' || ");

        qb.select(idColumn).where(
          `to_tsvector(${columnsRaw}) @@ ${PARSER_FUNCTIONS[parser]}(?)`,
          [query]
        );

        return {
          [idColumn]: { $in: qb.getKnexQuery() },
        };
      },
    };

    return target;
  };
}
