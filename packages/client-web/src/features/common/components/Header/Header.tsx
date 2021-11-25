import {
  Button,
  chakra,
  Flex,
  FlexProps,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRegGem } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { LoginButton } from "../../../auth/components/LoginButton";
import { RegisterButton } from "../../../auth/components/RegisterButton";
import { useSession } from "../../../auth/hooks/useSession";
import { LocaleSelect } from "../../../i18n/components/LocaleSelect";
import { ColorModeSwitcher } from "../../../theme/components/ColorModeSwitcher/ColorModeSwitcher";
import { CurrentUserMenu } from "../../../users/components/CurrentUserMenu/CurrentUserMenu";

export interface HeaderProps extends FlexProps {}

export const Header = (props: HeaderProps) => {
  const { isLoggedIn } = useSession();

  return (
    <chakra.header
      bg={useColorModeValue("gray.50", "gray.700")}
      color={useColorModeValue("gray.1z00", "gray.200")}
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
            leftIcon={<Icon as={FaRegGem} />}
          >
            {process.env.REACT_APP_DISPLAY_NAME}
          </Button>
        </HStack>
        <HStack spacing={3} alignItems="center">
          {!isLoggedIn && (
            <>
              <RegisterButton size="sm" colorScheme="blue" variant="solid" />
              <LoginButton size="sm" />
            </>
          )}
          <LocaleSelect />
          <ColorModeSwitcher justifySelf="flex-end" />
          {isLoggedIn && <CurrentUserMenu />}
        </HStack>
      </Flex>
    </chakra.header>
  );
};
