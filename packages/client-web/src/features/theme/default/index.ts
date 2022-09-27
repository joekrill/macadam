import { extendTheme } from "@chakra-ui/react";
import { Alert } from "./components/alert";
import { Link } from "./components/link";
import { colors } from "./foundations/colors";

// Theme generator: https://themera.vercel.app/

export const theme = extendTheme({
  config: {
    initialColorMode: "system",
  },
  colors,
  components: {
    Alert,
    Link,
  },
});
