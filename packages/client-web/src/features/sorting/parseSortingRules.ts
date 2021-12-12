import { SortingRule } from "react-table";

/**
 * Parsing a sort string, usually used as a URL parameter, into an array
 * of `SortingRule`s
 */
export const parseSortingRules = <D>(rulesString: string): SortingRule<D>[] =>
  rulesString.split(",").map((ruleString) => {
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
  });
