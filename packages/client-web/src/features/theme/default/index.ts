import { extendTheme } from "@chakra-ui/react";
import { Link } from "./components/link";

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    // useSystemColorMode: true,
  },
  components: {
    Link,
  },
});
