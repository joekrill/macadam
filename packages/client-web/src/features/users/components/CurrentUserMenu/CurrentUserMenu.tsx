import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { LogoutButtonLabel } from "../../../auth/components/LogoutButton/LogoutButton";
import { useLogout } from "../../../auth/hooks/useLogout";
import { CurrentUserAvatar } from "../CurrentUserAvatar/CurrentUserAvatar";
import { CurrentUserMenuHeader } from "./CurrentUserMenuHeader";

export interface CurrentUserMenuProps
  extends Omit<MenuProps, "isLazy" | "children"> {}

export const CurrentUserMenu = (props: CurrentUserMenuProps) => {
  const { onClick, isLoading } = useLogout();

  return (
    <Menu autoSelect={false} isLazy {...props}>
      <MenuButton rounded="full" variant="link" cursor="pointer">
        <CurrentUserAvatar size="sm" />
      </MenuButton>
      <Portal>
        <MenuList py="1" fontSize="sm">
          <CurrentUserMenuHeader />
          <MenuDivider />
          <MenuItem as={RouterLink} to="/settings">
            <FormattedMessage
              id="user.userMenu.profileLink"
              defaultMessage="Your Profile"
            />
          </MenuItem>
          <MenuItem as={RouterLink} to="/things?mine=1">
            <FormattedMessage
              id="user.userMenu.thingsLink"
              defaultMessage="Your Things"
            />
          </MenuItem>
          <MenuItem
            color={useColorModeValue("red.500", "red.300")}
            onClick={onClick}
            disabled={isLoading}
          >
            <LogoutButtonLabel />
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
