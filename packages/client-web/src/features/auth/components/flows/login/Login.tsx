import { VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "../../../../common/components/LoadingSpinner/LoadingSpinner";
import { useReturnToConsumer } from "../../../../routing/hooks/useReturnToConsumer";
import { LOGIN_PATH } from "../../LoginLink/useLoginLink";
import { RegistrationLink } from "../../RegistrationLink/RegistrationLink";
import { REGISTRATION_PATH } from "../../RegistrationLink/useRegistrationLink";
import { SelfServiceUiMessageList } from "../../SelfServiceUi/SelfServiceUiMessageList";
import { FlowErrorAlert } from "../FlowErrorAlert";
import { FlowHeading } from "../FlowHeading";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { LoginForm } from "./LoginForm";
import { LoginFormTitle } from "./LoginFormTitle";
import { useLoginFlow, UseLoginFlowOptions } from "./useLoginFlow";

export interface LoginProps extends UseLoginFlowOptions {}

export const Login = ({
  aal,
  flowId,
  refresh,
  returnTo: returnToProp,
}: LoginProps) => {
  const returnTo =
    useReturnToConsumer({
      preferred: returnToProp,
      forbid: [`${LOGIN_PATH}/*`, `${REGISTRATION_PATH}/*`],
    }) || "/";

  const {
    error,
    errorId,
    flow,
    isInitializing,
    isSubmitting,
    isSuccessful,
    restart,
    restartReason,
    submit,
  } = useLoginFlow({ aal, flowId, refresh, returnTo: returnToProp });

  // TODO: if `aal || refresh` show option to logout?

  return (
    <VStack align="stretch" spacing="4">
      {isSuccessful && <Navigate to={returnTo || "/"} />}
      <FlowHeading
        title={<LoginFormTitle flow={flow} />}
        subtitle={
          errorId !== "session_already_available" && !aal && !refresh ? (
            <FormattedMessage
              id="auth.login.signUpInsteadMessage"
              description="The message shown on the login page that directs the user to create an account instead of logging in."
              defaultMessage="Don't have an account yet? <link>Sign up!</link>"
              values={{
                link: (chunks) => <RegistrationLink>{chunks}</RegistrationLink>,
              }}
            />
          ) : undefined
        }
      />
      {restartReason && <FlowRestartedAlert reason={restartReason} />}
      {error && (
        <FlowErrorAlert
          error={error}
          onRestartFlow={restart}
          flowType="login"
        />
      )}
      <SelfServiceUiMessageList mt={3} messages={flow?.ui?.messages} />
      {flow && (
        <LoginForm flow={flow} isSubmitting={isSubmitting} onSubmit={submit} />
      )}
      {isInitializing && <LoadingSpinner />}
    </VStack>
  );
};
