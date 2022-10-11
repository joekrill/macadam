import {
  Box,
  HStack,
  StackProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "@macadam/api-client";
import { CurrentUserAvatar } from "../CurrentUserAvatar/CurrentUserAvatar";

export interface CurrentUserMenuHeaderProps extends StackProps {}

export const CurrentUserMenuHeader = (props: CurrentUserMenuHeaderProps) => {
  const { traits } = useSession();

  return (
    <HStack px="3" py="4" alignItems="center" {...props}>
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
