import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "../features/auth/components/AuthContext";
import { I18nProvider } from "../features/i18n/components/I18nProvider/I18nProvider";
import { theme } from "../features/theme/default";
import { store } from "./store";

export interface AppContextProps {
  children: ReactNode;
}

export const AppContext = ({ children }: AppContextProps) => (
  <>
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
              {children}
            </HelmetProvider>
          </I18nProvider>
        </AuthProvider>
      </ReduxProvider>
    </ChakraProvider>
  </>
);
