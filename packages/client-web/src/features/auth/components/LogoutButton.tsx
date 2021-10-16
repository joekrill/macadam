import { Button, ButtonProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { useLogout } from "../hooks/useLogout";

export interface LogoutButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const LogoutButton = ({
  children,
  onClick,
  onLogoutComplete,
  isDisabled,
  ...props
}: LogoutButtonProps) => {
  const { trigger, isPending } = useLogout();

  return (
    <Button
      {...props}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }

        if (!e.defaultPrevented) {
          trigger().then(onLogoutComplete);
        }
      }}
      isDisabled={isDisabled || isPending}
    >
      {children || (
        <FormattedMessage
          id="auth.logOutButton.label"
          defaultMessage="Log Out"
        />
      )}
    </Button>
  );
};
