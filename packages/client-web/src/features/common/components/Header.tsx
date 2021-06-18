import {
  Button,
  ButtonGroup,
  Flex,
  FlexProps,
  HStack,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { identityApi } from "../../identity/identityApi";
import { ColorModeSwitcher } from "../../theme/components/ColorModeSwitcher";

export interface HeaderProps extends FlexProps {}
export const Header = (props: HeaderProps) => {
  const { colorMode } = useColorMode();
  const whoami = identityApi.useWhoamiQuery();
  // whoami.isError;
  // const isAU = console.log("whoami", whoami);

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
