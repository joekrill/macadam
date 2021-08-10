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
import { LoginButton } from "../../../identity/components/LoginButton";
import { LogoutButton } from "../../../identity/components/LogoutButton";
import { useSession } from "../../../identity/hooks/useSession";
import { ColorModeSwitcher } from "../ColorModeSwitcher/ColorModeSwitcher";

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
        {session.isLoggedIn === true && <LogoutButton />}
        {session.isLoggedOut === true && <LoginButton />}
        {session.isLoggedOut === true && (
          <Button
            disabled={session.isLoading}
            as={RouterLink}
            to="/auth/registration"
            variant="solid"
          >
            Sign Up
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  );
};
