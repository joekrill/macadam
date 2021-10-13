import { useLocation } from "react-router-dom";
import { z } from "zod";

const LOGIN_PATH = "/auth/login";
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
  returnTo?: string;
}

export const useLoginLocation = ({
  returnTo,
}: UseLoginLocationOptions = {}) => {
  const location = useLocation<{ returnTo?: Location }>();
  const pathname = LOGIN_PATH;

  if (returnTo && isValidReturnToLocation(returnTo)) {
    return { pathname, state: { returnTo } };
  }

  if (
    location.state?.returnTo &&
    isValidReturnToLocation(location.state?.returnTo)
  ) {
    return { pathname, state: { returnTo: location.state?.returnTo } };
  }

  if (isValidReturnToLocation(location)) {
    return { pathname, state: { returnTo: location } };
  }

  return { pathname, state: { returnTo: DEFAULT_RETURN_TO_PATH } };
};
