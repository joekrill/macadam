import { useIntl } from "react-intl";
import { useReturnToProvider } from "../../../routing/hooks/useReturnToProvider";
import { REGISTRATION_PATH } from "../RegistrationLink/useRegistrationLink";

export const LOGIN_PATH = "/login";

export const useLoginLink = () => {
  const { formatMessage } = useIntl();
  const returnTo = useReturnToProvider({
    forbid: [`${LOGIN_PATH}/*`, `${REGISTRATION_PATH}/*`],
    fallback: "/",
  });

  return {
    to: LOGIN_PATH,
    state: returnTo ? { returnTo } : undefined,
    label: formatMessage({
      id: "auth.loginLink.label",
      defaultMessage: "Log In",
    }),
  };
};
