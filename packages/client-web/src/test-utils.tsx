import { ChakraProvider } from "@chakra-ui/react";
import { render, RenderOptions } from "@testing-library/react";
import * as React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "./app/store";
import { theme } from "./features/theme/default";

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ReduxProvider store={store}>
    <HelmetProvider>
      <MemoryRouter>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </MemoryRouter>
    </HelmetProvider>
  </ReduxProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
