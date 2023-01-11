import { NativeBaseProvider } from "native-base";
import { IntlProvider } from "react-intl";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { theme } from "../features/theme/default";
import { AppNavigation } from "../navigation/AppNavigation";
import { persistor, store } from "./store";

// TODO: Get active locale using expo-localization https://docs.expo.dev/guides/localization/
// TODO: https://www.npmjs.com/package/@config-plugins/android-jsc-intl
// TODO: https://formatjs.io/docs/react-intl/#react-native

export const App = () => (
  <IntlProvider locale="en" messages={{}} defaultLocale={"en"}>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider theme={theme}>
          <SafeAreaProvider>
            <AppNavigation />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </PersistGate>
    </ReduxProvider>
  </IntlProvider>
);
