import { Box, BoxProps, forwardRef, useColorModeValue } from "@chakra-ui/react";

export const Card = forwardRef<BoxProps, "div">((props, ref) => (
  <Box
    bg={useColorModeValue("white", "gray.700")}
    py="8"
    px={{ base: "4", md: "10" }}
    shadow="base"
    rounded={{ sm: "lg" }}
    {...props}
  />
));
