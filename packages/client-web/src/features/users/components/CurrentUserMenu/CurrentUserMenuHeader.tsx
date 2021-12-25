import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { useSession } from "../../../auth/hooks/useSession";
import { CurrentUserAvatar } from "../CurrentUserAvatar/CurrentUserAvatar";

export const CurrentUserMenuHeader = () => {
  const { traits } = useSession();

  return (
    <HStack px="3" py="4" alignItems="center">
      <CurrentUserAvatar size="sm" />
      <Box lineHeight="1">
        <Text fontWeight="semibold">{traits.name}</Text>
        <Text
          color={useColorModeValue("gray.500", "gray.400")}
          fontSize="sm"
          mt="1"
        >
          {traits.email}
        </Text>
      </Box>
    </HStack>
  );
};
