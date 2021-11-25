import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { useLogout } from "../hooks/useLogout";

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
        {children || (
          <FormattedMessage
            id="auth.logoutButton.label"
            defaultMessage="Log Out"
          />
        )}
      </Button>
    );
  }
);
