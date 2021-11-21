import { Link, VStack } from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useLoginFlow, UseLoginFlowOptions } from "../../hooks/useLoginFlow";
import { useLoginReturnToLocation } from "../../hooks/useLoginReturnToLocation";
import { FlowError } from "../FlowError";
import { FlowHeading } from "../FlowHeading";
import { FlowLoadingSpinner } from "../FlowLoadingSpinner";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { SelfServiceUiMessageList } from "../SelfServiceUi/SelfServiceUiMessageList";
import { LoginFlowTitle } from "./LoginFlowTitle";
import { LoginForm } from "./LoginForm";

export interface LoginProps extends UseLoginFlowOptions {}

export const Login = ({ aal, flowId, refresh, returnTo }: LoginProps) => {
  const history = useHistory();
  const returnToState = useLoginReturnToLocation();

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
  } = useLoginFlow({ aal, flowId, refresh, returnTo });

  useEffect(() => {
    if (isSuccessful) {
      history.push(returnTo || returnToState);
    }
  }, [isSuccessful, history, returnTo, returnToState]);

  // TODO: if `aal || refresh` show option to logout?

  return (
    <VStack align="stretch" spacing="4">
      <FlowHeading
        title={<LoginFlowTitle flow={flow} />}
        subtitle={
          errorId !== "session_already_available" && !aal && !refresh ? (
            <FormattedMessage
              id="auth.login.noAccountLink"
              defaultMessage="Don't have an account yet? <link>Sign up!</link>"
              values={{
                link: (chunks: ReactElement) => (
                  <Link as={RouterLink} to="/auth/registration">
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
      {isInitializing && <FlowLoadingSpinner />}
    </VStack>
  );
};
