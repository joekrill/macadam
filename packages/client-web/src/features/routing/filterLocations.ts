import { To } from "history";
import { matchPath } from "react-router-dom";

/**
 * Finds the first location from a list of candidates that is not included
 * in the list of paths to `forbid`.
 *
 * @param candidates The prioritized list of locations to consider
 * @param forbid A list of paths that should not be considered.
 * @returns
 */
export const filterLocations = (
  candidates: (To | undefined)[],
  forbid: string[]
) => {
  return candidates.find((candidate) => {
    if (!candidate) {
      return false;
    }

    if (!forbid.length) {
      return true;
    }

    const candidatePath =
      typeof candidate === "string" ? candidate : candidate.pathname;

    if (candidatePath === undefined) {
      return false;
    }

    return !forbid.some((path) => matchPath(path, candidatePath));
  });
};
