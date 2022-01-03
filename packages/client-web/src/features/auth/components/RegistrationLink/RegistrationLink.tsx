import {
  RouterLink,
  RouterLinkProps,
} from "../../../routing/components/RouterLink";
import { useRegistrationLink } from "./useRegistrationLink";

export interface RegistrationLinkProps extends Omit<RouterLinkProps, "to"> {}

export const RegistrationLink = ({
  children,
  ...props
}: RegistrationLinkProps) => {
  const { to, state, label } = useRegistrationLink();

  return (
    <RouterLink to={to} state={state} aria-label={label} {...props}>
      {children || label}
    </RouterLink>
  );
};
