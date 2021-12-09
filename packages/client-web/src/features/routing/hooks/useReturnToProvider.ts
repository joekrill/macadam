import { To, useLocation } from "react-router-dom";
import { filterLocations } from "../filterLocations";

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
}: UseReturnToProviderOptions) => {
  const location = useLocation();

  return filterLocations([location.state?.returnTo, location], {
    forbid,
    fallback,
  });
};
