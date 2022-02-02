import {
  Button,
  chakra,
  Flex,
  FlexProps,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { LoginButton } from "../../../features/auth/components/LoginLink/LoginLinkButton";
import { RegistrationLinkButton } from "../../../features/auth/components/RegistrationLink/RegistrationLinkButton";
import { useSession } from "../../../features/auth/hooks/useSession";
import { ColorModeSwitcher } from "../../../features/theme/components/ColorModeSwitcher/ColorModeSwitcher";
import { CurrentUserMenu } from "../../../features/user/components/CurrentUserMenu/CurrentUserMenu";
import { ReactComponent as Logo } from "../../Logo.svg";

export interface HeaderProps extends FlexProps {}

export const Header = (props: HeaderProps) => {
  const { isLoggedIn } = useSession();
  const buttonSchema = useColorModeValue("whiteAlpha", "gray");

  return (
    <chakra.header
      bg={useColorModeValue("gray.500", "gray.700")}
      color={useColorModeValue("gray.100", "gray.200")}
      w="full"
      px={{ base: 2, sm: 4 }}
      py={2}
      shadow="md"
    >
      <Flex alignItems="center" justifyContent="space-between" mx="auto">
        <HStack display="flex" spacing={3} alignItems="center">
          <Button
            as={RouterLink}
            variant="ghost"
            color="current"
            colorScheme="blackAlpha"
            to="/"
            leftIcon={<Icon as={Logo} boxSize={20} />}
          >
            {process.env.REACT_APP_DISPLAY_NAME}
          </Button>
        </HStack>
        <HStack spacing={3} alignItems="center">
          {!isLoggedIn && (
            <>
              <RegistrationLinkButton
                px="5"
                size="sm"
                colorScheme="yellow"
                variant="solid"
              />
              <LoginButton px="5" size="sm" colorScheme={buttonSchema} />
            </>
          )}
          <ColorModeSwitcher variant="ghost" color="current" />
          <CurrentUserMenu />
        </HStack>
      </Flex>
    </chakra.header>
  );
};
