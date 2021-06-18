import { Flex, Text, useColorMode } from "@chakra-ui/react";

export const Footer = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="nav"
      justifyContent="center"
      minHeight={20}
      borderTopColor={colorMode === "dark" ? "gray.600" : "gray.300"}
      borderTopStyle="solid"
      borderTopWidth="1px"
      bg={colorMode === "dark" ? "gray.700" : "gray.200"}
      p={6}
    >
      <Text>
        {process.env.REACT_APP_NAME} v{process.env.REACT_APP_VERSION}
      </Text>
    </Flex>
  );
};
