import { NavigationContainer } from "@react-navigation/native";
import { AppStack } from "./AppStack";

export const AppNavigation = () => (
  <NavigationContainer>
    <AppStack />
  </NavigationContainer>
);
