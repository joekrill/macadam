import {
  Button,
  ButtonGroup,
  Flex,
  FlexProps,
  HStack,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { FaRegGem } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { LoginButton } from "../../../auth/components/LoginButton";
import { LogoutButton } from "../../../auth/components/LogoutButton";
import { SignUpButton } from "../../../auth/components/SignUpButton";
import { useSession } from "../../../auth/hooks/useSession";
import { LocaleSelect } from "../../../i18n/components/LocaleSelect";
import { ColorModeSwitcher } from "../../../theme/components/ColorModeSwitcher/ColorModeSwitcher";

export const HeaderContext = createContext({
  useSession,
});

export interface HeaderProps extends FlexProps {}

export const Header = (props: HeaderProps) => {
  const { colorMode } = useColorMode();
  const headerContext = useContext(HeaderContext);
  const session = headerContext.useSession();

  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      bg={colorMode === "dark" ? "blue.500" : "white"}
      minHeight={12}
      p={2}
      boxShadow="md"
      {...props}
    >
      <HStack>
        <Button
          as={RouterLink}
          variant="ghost"
          color="current"
          colorScheme="blackAlpha"
          to="/"
          leftIcon={<Icon as={FaRegGem} />}
        >
          {process.env.REACT_APP_DISPLAY_NAME}
        </Button>
      </HStack>
      <ButtonGroup
        variant="ghost"
        color="current"
        colorScheme="blue"
        size="sm"
        alignItems="center"
      >
        <ColorModeSwitcher justifySelf="flex-end" />
        <LocaleSelect />
        {session.isLoggedIn === true && <LogoutButton />}
        {session.isLoggedOut === true && <LoginButton />}
        {session.isLoggedOut === true && <SignUpButton variant="solid" />}
      </ButtonGroup>
    </Flex>
  );
};
