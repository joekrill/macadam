import { useSession } from "@macadam/api-client";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";

export type RootStackParamList = {
  Home?: {};
  Login?: {};
  PasswordRecovery?: {};
  Register?: {};
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const AppStack = () => {
  const { isLoggedIn } = useSession();
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={HomeScreen} />
      {isLoggedIn ? (
        <></>
      ) : (
        <>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
};
