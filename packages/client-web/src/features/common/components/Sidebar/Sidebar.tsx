import { Box, BoxProps, useColorModeValue, VStack } from "@chakra-ui/react";

export interface SidebarProps extends BoxProps {}

export const Sidebar = ({
  children,
  "aria-label": ariaLabel = "Navigation",
  ...props
}: BoxProps) => {
  const borderWidth = "0";
  const borderHighlightWidth = "2px";
  const bg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.400");
  const borderHighlightColor = useColorModeValue("gray.200", "gray.400");

  return (
    <Box
      h={{ base: undefined, md: "full" }}
      w={{ base: "full", md: 60 }}
      p="2"
      minWidth={60}
      overflowX="hidden"
      overflowY="auto"
      bg={bg}
      borderColor={borderColor}
      borderWidth={borderWidth}
      borderRightColor={{
        base: borderColor,
        md: borderHighlightColor,
      }}
      borderBottomColor={{
        base: borderHighlightColor,
        md: borderColor,
      }}
      borderRightWidth={{ base: borderWidth, md: borderHighlightWidth }}
      borderBottomWidth={{ base: borderHighlightWidth, md: borderWidth }}
      {...props}
    >
      <VStack
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label={ariaLabel}
      >
        {children}
      </VStack>
    </Box>
  );
};
