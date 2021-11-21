import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { useLogout } from "../hooks/useLogout";

export interface LogoutButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const LogoutButton = forwardRef<LogoutButtonProps, "button">(
  ({ children, onClick, onLogoutComplete, isDisabled, ...props }, ref) => {
    const { trigger, isPending } = useLogout();

    return (
      <Button
        ref={ref}
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
            id="auth.logoutButton.label"
            defaultMessage="Log Out"
          />
        )}
      </Button>
    );
  }
);
