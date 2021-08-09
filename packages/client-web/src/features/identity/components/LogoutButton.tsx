import { Button, ButtonProps } from "@chakra-ui/react";
import { useLogout } from "../hooks/useLogout";

export interface LogoutButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const LogoutButton = ({
  children = "Log Out",
  onClick,
  onLogoutComplete,
  isDisabled,
  ...props
}: LogoutButtonProps) => {
  const { trigger, isPending } = useLogout();

  return (
    <Button
      {...props}
      onClick={(e) =>  {
        if (onClick) {
          onClick(e);
        }

        if (!e.defaultPrevented) {
          trigger().then(onLogoutComplete);
        }
      }}
      isDisabled={isDisabled || isPending}
    >
      {children}
    </Button>
  );
};
