import { To } from "history";
import { useLocation } from "react-router-dom";
import { filterLocations } from "../filterLocations";

export interface UseReturnToConsumerOptions {
  /**
   * An optional fallback value to use when an appropriate location is not
   * found based on the preferred location or the location stored in state.
   */
  fallback?: To;

  /**
   * A list of path's that should never be used as the return to value.
   * (For example, if redirecting from the login page, we would forbid
   * returning to the login page itself)
   */
  forbid?: string[];

  /**
   * An optional location explicitly preferred over any value found in the
   * router state.
   */
  preferred?: To;
}

/**
 * Returns an appropriate `returnTo` value that should be used by the current
 * page after completing an operation in which the user should be returned
 * to the place that brough them there.
 *
 * This is useful to, for example, send the user back to their original page
 * after logging them in.
 */
export const useReturnToConsumer = ({
  fallback = "/",
  forbid = [],
  preferred,
}: UseReturnToConsumerOptions) => {
  const { state } = useLocation();

  return filterLocations([preferred, state?.returnTo], {
    forbid,
    fallback,
  });
};
