import { expr } from "@mikro-orm/core";
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";

const PARSER_FUNCTIONS = {
  websearch: "websearch_to_tsquery",
  phrase: "phraseto_tsquery",
  plain: "plainto_tsquery",
  none: "to_tsquery",
};

export type TextSearchParser = keyof typeof PARSER_FUNCTIONS;

/**
 * Generates a filter property for executing a full-text search against a set
 * of columns.
 */
export const textSearch = (
  em: SqlEntityManager<PostgreSqlDriver>,
  columns: string[],
  search: string,
  parser: TextSearchParser = "websearch"
) => {
  const driverType = em.config.get("type");

  if (driverType !== "postgresql") {
    // TODO: impleent support for sqlite, etc?
    return {};
  }

  const knex = em.getKnex();
  const columnsRaw = knex.raw(columns.join(" || ' ' || ")).toQuery();
  const query = knex
    .raw(`to_tsvector(${columnsRaw}) @@ ${PARSER_FUNCTIONS[parser]}(?)`, [
      search,
    ])
    .toQuery();

  return {
    [expr(query)]: true,
  };
};
