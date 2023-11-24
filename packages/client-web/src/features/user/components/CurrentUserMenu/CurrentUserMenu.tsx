import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";
import { useLogout, useSession } from "@macadam/api-client";
import {
  FaCaretDown,
  FaCog,
  FaFileAlt,
  FaPencilAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { useLoginLink } from "../../../auth/components/LoginLink/useLoginLink";
import { LogoutButtonLabel } from "../../../auth/components/LogoutButton/LogoutButton";
import { useRegistrationLink } from "../../../auth/components/RegistrationLink/useRegistrationLink";
import { useAppPreferencesLink } from "../../../settings/components/AppPreferencesLink/useAppPreferencesLink";
import { useColorModeSwitch } from "../../../theme/components/ColorModeSwitcher/useColorModeSwitch";
import { CurrentUserAvatar } from "../CurrentUserAvatar/CurrentUserAvatar";
import { CurrentUserMenuHeader } from "./CurrentUserMenuHeader";

export type CurrentUserMenuProps = Omit<MenuProps, "isLazy" | "children">;

export const CurrentUserMenu = (props: CurrentUserMenuProps) => {
  const { formatMessage } = useIntl();
  const { isLoggedIn, isUnknown } = useSession();
  const preferencesLink = useAppPreferencesLink();
  const registrationLink = useRegistrationLink();
  const loginLink = useLoginLink();
  const logoutColor = useColorModeValue("red.500", "red.300");
  const { onClick, isLoading } = useLogout();
  const {
    label: colorModeLabel,
    toggleColorMode,
    Icon: ColorModeIcon,
  } = useColorModeSwitch();

  return (
    <Menu autoSelect={false} isLazy {...props}>
      <MenuButton
        isLoading={isUnknown}
        as={Button}
        variant="link"
        cursor="pointer"
        colorScheme={useColorModeValue("whiteAlpha", "gray")}
        rightIcon={<Icon as={FaCaretDown} boxSize="4" />}
        leftIcon={
          <CurrentUserAvatar
            bg={useColorModeValue("blue.400", "blue.200")}
            size="sm"
          />
        }
        iconSpacing="0.1em"
        size="sm"
        aria-label={formatMessage({
          id: "user.userMenu.label",
          defaultMessage: "User menu",
        })}
      >
        <CurrentUserAvatar size="sm" />
      </MenuButton>
      <Portal>
        <MenuList py="1" fontSize="sm">
          <CurrentUserMenuHeader hidden={!isLoggedIn} />
          <MenuDivider hidden={!isLoggedIn} />
          <MenuItem as={RouterLink} icon={<FaCog />} to={preferencesLink.to}>
            {preferencesLink.label}
          </MenuItem>
          <MenuItem
            as={RouterLink}
            hidden={!isLoggedIn}
            icon={<FaUserCog />}
            to="/settings/profile"
          >
            <FormattedMessage
              id="user.userMenu.profileLink"
              defaultMessage="Your Profile"
            />
          </MenuItem>
          <MenuItem icon={<ColorModeIcon />} onClick={toggleColorMode}>
            {colorModeLabel}
          </MenuItem>
          <MenuItem
            as={RouterLink}
            hidden={!isLoggedIn}
            icon={<FaFileAlt />}
            to="/things?mine=1"
          >
            <FormattedMessage
              id="user.userMenu.thingsLink"
              defaultMessage="Your Things"
            />
          </MenuItem>
          <MenuDivider hidden={!isLoggedIn} />
          <MenuItem
            color={logoutColor}
            disabled={isLoading}
            hidden={!isLoggedIn}
            icon={<FaSignOutAlt />}
            onClick={onClick}
          >
            <LogoutButtonLabel />
          </MenuItem>
          <MenuDivider hidden={isLoggedIn} />
          <MenuItem
            as={RouterLink}
            fontWeight="semibold"
            hidden={isLoggedIn}
            icon={<FaPencilAlt />}
            state={registrationLink.state}
            to={registrationLink.to}
          >
            {registrationLink.label}
          </MenuItem>
          <MenuItem
            as={RouterLink}
            fontWeight="semibold"
            hidden={isLoggedIn}
            icon={<FaSignInAlt />}
            state={loginLink.state}
            to={loginLink.to}
          >
            {loginLink.label}
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
