import { extendTheme } from "@chakra-ui/react";
import { Alert } from "./components/alert";
import { Link } from "./components/link";

// Theme generator: https://themera.vercel.app/

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    // useSystemColorMode: true,
  },
  components: {
    Alert,
    Link,
  },
});
