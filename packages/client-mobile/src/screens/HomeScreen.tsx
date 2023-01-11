import { useSession } from "@macadam/api-client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Alert, Box, Button, Text } from "native-base";
import { LogoutButton } from "../features/auth/components/LogoutButton";
import { RootStackParamList } from "../navigation/AppStack";
export interface HomeScreenProps
  extends NativeStackScreenProps<RootStackParamList, "Home"> {}

export const HomeScreen = ({ navigation, route }: HomeScreenProps) => {
  const { isLoggedIn, username } = useSession();

  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Alert>
        <Alert.Icon />
        <Text>{isLoggedIn ? `Logged in as ${username}` : "Not Logged in"}</Text>
      </Alert>

      {isLoggedIn ? (
        <LogoutButton />
      ) : (
        <>
          <Button onPress={() => navigation.navigate("Login")}>Log In</Button>
          <Button onPress={() => navigation.navigate("Register")}>
            Register
          </Button>
        </>
      )}

      <StatusBar />
    </Box>
  );
};
