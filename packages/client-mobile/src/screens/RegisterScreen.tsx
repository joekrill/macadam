import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, ScrollView } from "native-base";
import { Registration } from "../features/auth/components/registration/Registration";
import { RootStackParamList } from "../navigation/AppStack";

export interface HomeScreenProps
  extends NativeStackScreenProps<RootStackParamList, "Register"> {}

export const RegisterScreen = ({ navigation, route }: HomeScreenProps) => (
  <ScrollView>
    <Box p="4" flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Registration />
    </Box>
  </ScrollView>
  // <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
  //   <Text>Login</Text>
  //   <StatusBar />
  // </Box>
);
