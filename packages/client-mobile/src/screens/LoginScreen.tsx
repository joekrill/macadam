import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, ScrollView } from "native-base";
import { Login } from "../features/auth/components/login/Login";
import { RootStackParamList } from "../navigation/AppStack";

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LoginScreen = ({ navigation, route }: HomeScreenProps) => (
  <ScrollView>
    <Box p="4" flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Login />
    </Box>
  </ScrollView>
);
