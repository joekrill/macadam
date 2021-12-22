import { FormattedMessage } from "react-intl";
import {
  RouterLink,
  RouterLinkProps,
} from "../../../routing/components/RouterLink";
import { useRegistrationLocation } from "../../hooks/useRegistrationLocation";

export const RegistrationLinkLabel = () => (
  <FormattedMessage id="auth.registrationLink.label" defaultMessage="Sign Up" />
);

export interface RegistrationLinkProps extends RouterLinkProps {}

export const RegistrationLink = ({
  children,
  ...props
}: RegistrationLinkProps) => {
  const { to, state } = useRegistrationLocation();

  return (
    <RouterLink {...props} to={to} state={state}>
      {children || <RegistrationLinkLabel />}
    </RouterLink>
  );
};
