import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { useSession } from "../../../auth/hooks/useSession";
import { CurrentUserAvatar } from "../CurrentUserAvatar/CurrentUserAvatar";

export const CurrentUserMenuHeader = () => {
  const { email, fullName } = useSession();

  return (
    <HStack px="3" py="4" alignItems="center">
      <CurrentUserAvatar size="sm" />
      <Box lineHeight="1">
        <Text fontWeight="semibold">{fullName}</Text>
        <Text
          color={useColorModeValue("gray.500", "gray.400")}
          fontSize="sm"
          mt="1"
        >
          {email}
        </Text>
      </Box>
    </HStack>
  );
};
