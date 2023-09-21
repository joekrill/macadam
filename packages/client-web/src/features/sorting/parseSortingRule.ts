import { ColumnSort } from "@tanstack/react-table";

/**
 * Parses a single sort rule.
 */
export const parseSortingRule = (ruleString: string): ColumnSort => {
  const firstChar = ruleString.charAt(0);

  if (firstChar === "-") {
    return {
      desc: true,
      id: ruleString.substring(1),
    };
  }

  return {
    desc: false,
    id: firstChar === "+" ? ruleString.substring(1) : ruleString,
  };
};
