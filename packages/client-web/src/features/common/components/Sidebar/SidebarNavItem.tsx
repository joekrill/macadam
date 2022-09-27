import {
  Button,
  ButtonProps,
  forwardRef,
  useColorModeValue,
} from "@chakra-ui/react";

export interface SidebarNavItemProps extends ButtonProps {}

export const SidebarNavItem = forwardRef<ButtonProps, "button">(
  (props: SidebarNavItemProps, ref) => (
    <Button
      ref={ref}
      width="full"
      variant={useColorModeValue("solid", "ghost")}
      colorScheme="gray"
      textAlign="left"
      justifyContent="start"
      {...props}
    />
  )
);
