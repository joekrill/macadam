import { FormattedMessage } from "react-intl";
import {
  RouterLink,
  RouterLinkProps,
} from "../../routing/components/RouterLink";
import { useRegistrationLocation } from "../hooks/useRegistrationLocation";

export interface RegisterLinkProps extends RouterLinkProps {}

export const RegisterLink = ({ children, ...props }: RegisterLinkProps) => {
  const { to, state } = useRegistrationLocation();

  return (
    <RouterLink {...props} to={to} state={state}>
      {children || (
        <FormattedMessage
          id="auth.registerLink.content"
          defaultMessage="Sign Up"
        />
      )}
    </RouterLink>
  );
};
