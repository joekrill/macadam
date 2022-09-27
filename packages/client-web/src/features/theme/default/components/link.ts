import { ChakraTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const Link: ChakraTheme["components"]["Link"] = {
  baseStyle: (props: StyleFunctionProps) => ({
    textDecoration: "underline",
    color: mode("blue.500", "blue.300")(props),
  }),
};
