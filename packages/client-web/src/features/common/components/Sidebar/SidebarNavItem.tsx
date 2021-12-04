import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";

export interface SidebarNavItemProps extends ButtonProps {}

export const SidebarNavItem = forwardRef<ButtonProps, "button">(
  (props: SidebarNavItemProps, ref) => (
    <Button
      ref={ref}
      isFullWidth
      variant="ghost"
      textAlign="left"
      justifyContent="start"
      {...props}
    />
  )
);
