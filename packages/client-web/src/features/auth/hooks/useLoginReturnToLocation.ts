// import { } from "react-router";
import { useLocation } from "react-router-dom";
import { z } from "zod";

const DEFAULT_RETURN_TO_PATH = "/";

const returnToPathnameSchema = z
  .string()
  .refine((pathname) => !pathname.startsWith("/auth"));

const returnToLocationSchema = z.union([
  returnToPathnameSchema,
  z.object({
    pathname: returnToPathnameSchema,
    search: z.string().optional(),
    state: z.unknown().optional(),
    hash: z.string().optional(),
    key: z.string().optional(),
  }),
]);

function isValidReturnToLocation(
  location: unknown
): location is z.infer<typeof returnToLocationSchema> {
  return returnToLocationSchema.safeParse(location).success;
}

export interface UseLoginLocationOptions {
  returnTo?: string | Location;
}

/**
 * Returns the location that a user should be returned to after logging in,
 * given the current location and existing state.
 */
export const useLoginReturnToLocation = ({
  returnTo,
}: UseLoginLocationOptions = {}) => {
  const location = useLocation<{ returnTo?: Location }>();

  if (isValidReturnToLocation(returnTo)) {
    // If an explicit returnTo was given, that should be used.
    return returnTo;
  }

  if (isValidReturnToLocation(location.state?.returnTo)) {
    // If we've already got a `returnTo` in state, use that.
    return location.state?.returnTo;
  }

  if (isValidReturnToLocation(location)) {
    // Otherwise, use the current location as long as it's value (i.e. not an /auth endpoint)
    return location;
  }

  // If nothing else, just return to the home page.
  return DEFAULT_RETURN_TO_PATH;
};
