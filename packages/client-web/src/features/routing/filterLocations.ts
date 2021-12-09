import { To } from "history";
import { matchPath } from "react-router-dom";

export interface FilterLocationsOptions {
  /**
   * An optional fallback value to use when an appropriate location is not
   * found in the given candidates. This value will not be checked against
   * the forbidden locations.
   */
  fallback?: To;

  /**
   * A list of path's that should not be considered when matched by a candidate
   * (For example, if redirecting from the login page, we would forbid
   * returning to the login page itself)
   */
  forbid: string[];
}

/**
 * Finds the first location from a list of candidates that is not included
 * in the list of paths to `forbid`.
 *
 * @param candidates The prioritized list of locations to consider
 * @param options
 * @returns
 */
export const filterLocations = (
  candidates: (To | undefined)[],
  { forbid, fallback }: FilterLocationsOptions
) => {
  if (!forbid.length) {
    return candidates[0] || fallback;
  }

  return (
    candidates.find((candidate) => {
      if (!candidate) {
        return false;
      }

      const candidatePath =
        typeof candidate === "string" ? candidate : candidate.pathname;

      if (candidatePath === undefined) {
        return false;
      }

      return !forbid.some((path) => matchPath(path, candidatePath));
    }) || fallback
  );
};
