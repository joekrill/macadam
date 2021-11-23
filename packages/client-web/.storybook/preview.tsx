import {
  ChakraProvider,
  theme as chakraDefaultTheme,
  useColorMode,
} from "@chakra-ui/react";
import { action } from "@storybook/addon-actions";
import { StoryContext } from "@storybook/react";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { theme as appTheme } from "../src/features/theme/default";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    exclude: /(^_.*|as)/,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [process.env.REACT_APP_DISPLAY_NAME],
    },
  },
};

export const globalTypes = {
  theme: {
    name: "Theme",
    defaultValue: null,
    toolbar: {
      icon: "paintbrush",
      items: [
        { value: null, title: "App Theme" },
        { value: "chakra", title: "Chakra Default Theme" },
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
};

const withColorMode = (StoryFn: Function, context: StoryContext) => {
  if (context.parameters.themingDisabled === true) {
    return <StoryFn />;
  }

  const desiredColorMode = context.globals.darkMode ? "dark" : "light";
  const { setColorMode, colorMode: currentColorMode } = useColorMode();
  useEffect(() => {
    if (desiredColorMode !== currentColorMode) {
      setColorMode(desiredColorMode);
    }

    // HACK: setColorMode doesn't seem to always work. This may be a chakra
    // bug. In the meantime, this fixes things.
    document.documentElement.style.setProperty(
      "--chakra-ui-color-mode",
      desiredColorMode
    );
  });

  return <StoryFn />;
};

const withTheme = (StoryFn: Function, context: StoryContext) => {
  if (context.parameters.themingDisabled === true) {
    return <StoryFn />;
  }

  return (
    <ChakraProvider
      theme={context.globals.theme === "chakra" ? chakraDefaultTheme : appTheme}
    >
      <StoryFn />
    </ChakraProvider>
  );
};

const withRtl = (StoryFn: Function, context: StoryContext) => (
  <div dir={context.globals.rtl ? "rtl" : "ltr"}>
    <StoryFn />
  </div>
);

const withHelmet = (StoryFn: Function) => (
  <HelmetProvider>
    <StoryFn />
  </HelmetProvider>
);

const withRouter = (StoryFn: Function) => (
  <MemoryRouter initialEntries={["/"]}>
    <StoryFn />
  </MemoryRouter>
);

const withIntl = (StoryFn: Function) => (
  <IntlProvider locale="en-US" defaultLocale="en">
    <StoryFn />
  </IntlProvider>
);

const withRedux = (StoryFn: Function, context: StoryContext) => (
  <ReduxProvider
    store={{
      dispatch: (a) => {
        action("dispatch");
        return a;
      },
      getState: () => context.parameters.state,
      replaceReducer: () => 0,
      subscribe: () => () => 0,
      [Symbol.observable]() {
        return this;
      },
    }}
  >
    <StoryFn />
  </ReduxProvider>
);

export const decorators = [
  withColorMode,
  withTheme,
  withRtl,
  withHelmet,
  withRouter,
  withIntl,
  withRedux,
];
