import { Link, VStack } from "@chakra-ui/react";
import { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { LoadingSpinner } from "../../../common/components/LoadingSpinner/LoadingSpinner";
import { useReturnToConsumer } from "../../../routing/hooks/useReturnToConsumer";
import { useLoginFlow, UseLoginFlowOptions } from "../../hooks/useLoginFlow";
import { LOGIN_PATH } from "../../hooks/useLoginLocation";
import { REGISTRATION_PATH } from "../../hooks/useRegistrationLocation";
import { FlowError } from "../FlowError";
import { FlowHeading } from "../FlowHeading";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { SelfServiceUiMessageList } from "../SelfServiceUi/SelfServiceUiMessageList";
import { LoginForm } from "./LoginForm";
import { LoginFormTitle } from "./LoginFormTitle";

export interface LoginProps extends UseLoginFlowOptions {}

export const Login = ({
  aal,
  flowId,
  refresh,
  returnTo: returnToProp,
}: LoginProps) => {
  const returnTo = useReturnToConsumer({
    preferred: returnToProp,
    forbid: [`${LOGIN_PATH}/*`, `${REGISTRATION_PATH}/*`],
  });

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
                link: (chunks: ReactElement) => (
                  <Link as={RouterLink} to={REGISTRATION_PATH}>
                    {chunks}
                  </Link>
                ),
              }}
            />
          ) : undefined
        }
      />
      {restartReason && <FlowRestartedAlert reason={restartReason} />}
      {error && (
        <FlowError error={error} onRestartFlow={restart} flowType="login" />
      )}
      <SelfServiceUiMessageList mt={3} messages={flow?.ui?.messages} />
      {flow && (
        <LoginForm flow={flow} isSubmitting={isSubmitting} onSubmit={submit} />
      )}
      {isInitializing && <LoadingSpinner />}
    </VStack>
  );
};
