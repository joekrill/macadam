import { Box, ScrollView } from "native-base";
import { Registration } from "../features/auth/registration/Registration";

// export type HomeScreenProps = NativeStackScreenProps<
//   RootStackParamList,
//   "Register"
// >;

export const RegisterScreen = () => (
  <ScrollView>
    <Box p="4" flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Registration />
    </Box>
  </ScrollView>
);
