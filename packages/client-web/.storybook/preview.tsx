import { useEffect } from "react";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { StoryContext } from "@storybook/react";
import { theme } from "../src/features/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  rtl: {
    name: "Direction",
    description: "Reading direction",
    defaultValue: null,
    toolbar: {
      icon: "globe",
      items: [
        { value: null, title: "LTR reading direction" },
        { value: "rtl", title: "RTL reading direction" },
      ],
    },
  },
  darkMode: {
    name: "Color mode",
    description: "Color mode",
    defaultValue: "",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: null, icon: "circlehollow", title: "Light color mode" },
        { value: "dark", icon: "circle", title: "Dark color mode" },
      ],
    },
  },
};

const SyncColorMode = ({ colorMode: desiredColorMode }) => {
  const { setColorMode, colorMode } = useColorMode();

  useEffect(() => {
    if (colorMode !== desiredColorMode) {
      setColorMode(() => desiredColorMode);
    }
  });

  return null;
};

const withChakra = (StoryFn: Function, context: StoryContext) => {
  const { rtl, darkMode } = context.globals;
  return (
    <ChakraProvider theme={theme}>
      <div dir={rtl ? "rtl" : "ltr"}>
        <SyncColorMode colorMode={darkMode ? "dark" : "light"} />
        <StoryFn />
      </div>
    </ChakraProvider>
  );
};

export const decorators = [withChakra];
