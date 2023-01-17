import {
  useRegistrationFlow,
  UseRegistrationFlowOptions,
} from "@macadam/api-client";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button, Spinner, VStack } from "native-base";
import { FormattedMessage } from "react-intl";
import { RootStackParamList } from "../../../../navigation/AppStack";
// import { Navigate } from "react-router-dom";
// import { useReturnToConsumer } from "../../../../routing/hooks/useReturnToConsumer";
// import { LoginLink } from "../../LoginLink/LoginLink";
// import { LOGIN_PATH } from "../../LoginLink/useLoginLink";
// import { REGISTRATION_PATH } from "../../RegistrationLink/useRegistrationLink";
import { FlowErrorAlert } from "../FlowErrorAlert";
import { FlowHeading } from "../FlowHeading";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { SelfServiceUiMessageList } from "../SelfServiceUi/SelfServiceUiMessageList";
import { RegistrationForm } from "./RegistrationForm";

export interface RegistrationProps extends UseRegistrationFlowOptions {}

export const Registration = ({
  flowId,
  returnTo: returnToProp,
}: RegistrationProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const returnTo =
  //   useReturnToConsumer({
  //     preferred: returnToProp,
  //     forbid: [`${LOGIN_PATH}/*`, `${REGISTRATION_PATH}/*`],
  //   }) || "/";

  const {
    error,
    flow,
    isInitializing,
    isSubmitting,
    // isSuccessful,
    restart,
    restartReason,
    submit,
  } = useRegistrationFlow({ flowId, returnTo: returnToProp });

  return (
    <VStack alignItems="stretch" space="4">
      {/* {isSuccessful && <Navigate to={returnTo || "/"} />} */}
      <FlowHeading
        title={
          <FormattedMessage
            id="auth.registration.title"
            description="The title displayed at the top of the registration form"
            defaultMessage="Create your account"
          />
        }
        subtitle={
          <FormattedMessage
            id="auth.registration.alreadyHaveAccountLink"
            defaultMessage="Already have an account? {loginLink}"
            values={{
              // loginLink: <LoginLink />,
              loginLink: (
                <Button
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                />
              ),
            }}
          />
        }
      />
      {restartReason && <FlowRestartedAlert reason={restartReason} />}
      {error && (
        <FlowErrorAlert
          error={error}
          onRestartFlow={restart}
          flowType="registration"
        />
      )}
      <SelfServiceUiMessageList mt={3} messages={flow?.ui?.messages} />
      {flow && (
        <RegistrationForm
          flow={flow}
          isSubmitting={isSubmitting}
          onSubmit={submit}
        />
      )}
      {isInitializing && (
        <Spinner accessibilityLabel="Loading registation form" />
      )}
    </VStack>
  );
};
