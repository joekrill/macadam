import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, Box, Text } from "native-base";
import { theme } from "../features/theme/default";

export const App = () => (
  <NativeBaseProvider theme={theme}>
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar />
    </Box>
  </NativeBaseProvider>
);
