import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ILinkProps, Link } from "native-base";
import { RootStackParamList } from "../../../navigation/AppStack";

export interface RecoveryLinkProps extends Omit<ILinkProps, "onPress"> {}

export const RecoveryLink = ({ children, ...props }: RecoveryLinkProps) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "PasswordRecovery">
    >();

  // TODO: i18n

  return (
    <Link onPress={() => navigation.navigate("PasswordRecovery")} {...props}>
      {children || "Forgot Password"}
    </Link>
  );
};
