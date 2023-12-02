import { ChakraProvider } from "@chakra-ui/react";
import * as TestingLibrary from "@testing-library/react";
import * as React from "react";
import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "./app/store";
import { getMessages } from "./features/i18n/loadMessages";
import { theme } from "./features/theme/default";

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ReduxProvider store={store}>
    <IntlProvider locale="en" messages={getMessages("en")} defaultLocale="en">
      <HelmetProvider>
        <MemoryRouter>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </MemoryRouter>
      </HelmetProvider>
    </IntlProvider>
  </ReduxProvider>
);

const customRender = (
  ui: React.ReactElement,
  options?: TestingLibrary.RenderOptions,
) => TestingLibrary.render(ui, { wrapper: AllProviders, ...options });

// eslint-disable-next-line import/export
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export { customRender as render };
