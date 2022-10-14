import { authApi } from "@macadam/api-client";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { Box, NativeBaseProvider, Text } from "native-base";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { theme } from "../features/theme/default";
import { persistor, store } from "./store";

const HomeScreen = () => {
  const { data, isLoading, error } = authApi.useWhoamiQuery();

  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>API_HOST: {Constants.expoConfig?.extra?.apiHost}</Text>
      <Text>Data: {JSON.stringify(data)}</Text>
      <Text>isLoading: {JSON.stringify(isLoading)}</Text>
      <Text>error: {JSON.stringify(error)}</Text>
      <StatusBar />
    </Box>
  );
};

const Stack = createNativeStackNavigator();

export const App = () => (
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </PersistGate>
  </ReduxProvider>
);
