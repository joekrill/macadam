import { useLoginReturnToLocation } from "./useLoginReturnToLocation";

const LOGIN_PATH = "/auth/login";

export interface UseLoginLocationOptions {
  returnTo?: string;
}

export const useLoginLocation = ({
  returnTo,
}: UseLoginLocationOptions = {}) => ({
  state: {
    returnTo: useLoginReturnToLocation({ returnTo }),
  },
  pathname: LOGIN_PATH,
});
