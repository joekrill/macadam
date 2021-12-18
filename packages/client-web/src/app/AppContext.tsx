import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "../features/auth/components/AuthContext";
import { I18nProvider } from "../features/i18n/components/I18nProvider";
import { theme } from "../features/theme/default";
import { store } from "./store";

export interface AppContextProps {
  children: ReactNode;
}

export const AppContext = ({ children }: AppContextProps) => (
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ReduxProvider store={store}>
      <AuthProvider>
        <I18nProvider>
          <ChakraProvider theme={theme}>
            <HelmetProvider>
              <Helmet
                titleTemplate={`%s - ${process.env.REACT_APP_DISPLAY_NAME}`}
                defaultTitle={process.env.REACT_APP_DISPLAY_NAME}
              />
              {children}
            </HelmetProvider>
          </ChakraProvider>
        </I18nProvider>
      </AuthProvider>
    </ReduxProvider>
  </>
);
