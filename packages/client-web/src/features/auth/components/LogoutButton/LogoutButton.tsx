import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";
import { useLogout } from "@macadam/api-client";
import { FormattedMessage } from "react-intl";

export const LogoutButtonLabel = () => (
  <FormattedMessage
    id="auth.logoutButton.text"
    description="The text for the link that the user can click to log out"
    defaultMessage="Log Out"
  />
);

export interface LogoutButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const LogoutButton = forwardRef<LogoutButtonProps, "button">(
  ({ children, onClick, onLogoutComplete, ...props }, ref) => {
    const { onClick: onClickHandler, isLoading } = useLogout({
      onClick,
      onLogoutComplete,
    });

    return (
      <Button
        ref={ref}
        {...props}
        onClick={onClickHandler}
        isLoading={isLoading}
      >
        {children || <LogoutButtonLabel />}
      </Button>
    );
  },
);
