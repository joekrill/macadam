import {
  Button,
  ButtonGroup,
  Flex,
  FlexProps,
  HStack,
  Icon,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { FaRegGem } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useWhoamiQuery } from "../../../identity/identityApi";
import { ColorModeSwitcher } from "../ColorModeSwitcher/ColorModeSwitcher";

export const HeaderContext = createContext({
  useWhoamiQuery,
});

export interface HeaderProps extends FlexProps {}

export const Header = (props: HeaderProps) => {
  const { colorMode } = useColorMode();
  const { useWhoamiQuery } = useContext(HeaderContext);
  const whoami = useWhoamiQuery();

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
          {process.env.REACT_APP_NAME}
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
        {whoami.isSuccess && (
          <Button
            as={Link}
            textDecoration="none"
            _hover={{ textDecoration: "none" }}
            href="/self-service/browser/flows/logout"
          >
            Logout
          </Button>
        )}

        {!whoami.isSuccess && (
          <Button disabled={whoami.isLoading} as={RouterLink} to="/auth/login">
            Log in
          </Button>
        )}
        {!whoami.isSuccess && (
          <Button
            disabled={whoami.isLoading}
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
