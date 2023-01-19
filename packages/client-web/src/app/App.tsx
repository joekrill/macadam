import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { wrapCreateBrowserRouter } from "@sentry/react";
import { StrictMode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../features/auth/components/AuthContext";
import { ErrorBoundary } from "../features/errors/components/ErrorBoundary";
import { UnexpectedErrorPage } from "../features/errors/components/UnexpectedErrorPage/UnexpectedErrorPage";
import { I18nProvider } from "../features/i18n/components/I18nProvider/I18nProvider";
import { theme } from "../features/theme/default";
import { routes } from "./routes";
import { store } from "./store";

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);
const router = sentryCreateBrowserRouter(routes);

export const App = () => (
  <StrictMode>
    <ErrorBoundary fallback={UnexpectedErrorPage}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <ReduxProvider store={store}>
          <AuthProvider>
            <I18nProvider>
              <HelmetProvider>
                <Helmet
                  titleTemplate={`%s - ${process.env.VITE_DISPLAY_NAME}`}
                  defaultTitle={process.env.VITE_DISPLAY_NAME}
                />
                <RouterProvider router={router} />
              </HelmetProvider>
            </I18nProvider>
          </AuthProvider>
        </ReduxProvider>
      </ChakraProvider>
    </ErrorBoundary>
  </StrictMode>
);
