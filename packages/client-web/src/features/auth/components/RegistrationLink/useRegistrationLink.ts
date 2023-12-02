import { useIntl } from "react-intl";
import { useReturnToProvider } from "../../../routing/hooks/useReturnToProvider";
import { LOGIN_PATH } from "../LoginLink/useLoginLink";

export const REGISTRATION_PATH = "/signup";

export const useRegistrationLink = () => {
  const { formatMessage } = useIntl();
  const returnTo = useReturnToProvider({
    forbid: [`${LOGIN_PATH}/*`, `${REGISTRATION_PATH}/*`],
    fallback: "/",
  });

  return {
    to: REGISTRATION_PATH,
    state: returnTo ? { returnTo } : undefined,
    label: formatMessage({
      id: "auth.registrationLink.text",
      description:
        "The text for the link that will take the user to the new user registration form",
      defaultMessage: "Sign Up",
    }),
  };
};
