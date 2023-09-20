import { To, useLocation } from "react-router-dom";
import { z } from "zod";
import { filterLocations } from "../filterLocations";

export const returnToStateSchema = z.object({
  returnTo: z.union([
    z.string(),
    z.object({
      pathname: z.string(),
      hash: z.string().optional(),
      search: z.string().optional(),
    }),
  ]),
});

export interface UseReturnToProviderOptions {
  /**
   * An optional fallback value to use when an appropriate location is not
   * found based on the an existing returnTo or the current location.
   */
  fallback?: To;

  /**
   * A list of path's that should never be used as the return to value.
   * (For example, if redirecting to the login page, we would forbid
   * returning to the login page itself)
   */
  forbid?: string[];
}

/**
 * Returns an appropriate `returnTo` value to provide when sending a user to a
 * temporary page, that indicates where to return the user to when finished.
 *
 * This is useful to, for example, send the user to login page and return them
 * back to the current page after they've succesfully logged in.
 */
export const useReturnToProvider = ({
  fallback,
  forbid = [],
}: UseReturnToProviderOptions = {}) => {
  const { pathname, state } = useLocation();
  const parsed = returnToStateSchema.safeParse(state);

  return (
    filterLocations(
      [parsed.success ? parsed.data.returnTo : undefined, pathname],
      forbid,
    ) || fallback
  );
};
