import { Box, Container, Link, Spinner, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { Card } from "../../common/components/Card/Card";
import { useIsLoggedIn } from "../hooks/useIsLoggedIn";
import { identityApi, useWhoamiQuery } from "../identityApi";
import {
  isSelfServiceLoginFlow,
  isSelfServiceLoginFlowSuccess,
} from "../schemas";
import { FlowError } from "./FlowError";
import { LoggedInNotice } from "./LoggedInNotice";
import { SelfServiceUiForm } from "./SelfServiceUiForm";
import { SelfServiceUiMessageList } from "./SelfServiceUiMessageList";

export const Login = () => {
  const whoamiQuery = useWhoamiQuery();
  const history = useHistory();
  const location = useLocation<{ from?: Location }>();
  const isLoggedIn = useIsLoggedIn();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loginFlowQuery = identityApi.useInitializeLoginFlowQuery(undefined, {
    skip: isLoggedIn !== false, // Don't initialize the query unless we have determined we aren't logged in already.
  });
  const [submitLogin, submitResult] = identityApi.useSubmitLoginFlowMutation();

  const isInitializing = isLoggedIn === undefined || loginFlowQuery.isLoading;
  const isLoading = isInitializing || submitResult.isLoading;
  const isSuccess = isSelfServiceLoginFlowSuccess(submitResult.data);

  const data =
    (isSubmitted &&
      isSelfServiceLoginFlow(submitResult.data) &&
      submitResult.data) ||
    loginFlowQuery.data;
  const error = (isSubmitted && submitResult.error) || loginFlowQuery.error;

  useEffect(() => {
    if (isSuccess) {
      whoamiQuery.refetch();
    }
  }, [isSuccess, whoamiQuery.refetch]);

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      history.replace(
        location.state?.from || {
          pathname: "/",
        }
      );
    }
  }, [isSuccess, isLoggedIn, history.replace, location.state?.from]);

  const restart = useCallback(() => {
    loginFlowQuery.refetch();
    setIsSubmitted(false);
  }, [loginFlowQuery.refetch, setIsSubmitted]);

  return (
    <Container maxW="container.sm">
      {isLoggedIn && !isSubmitted ? (
        <LoggedInNotice onLogout={() => restart()} />
      ) : (
        <Card>
          {error && !isLoading && <FlowError onRetry={() => restart()} />}
          {data?.ui && (
            <SelfServiceUiForm
              ui={data.ui}
              isSubmitting={submitResult.isLoading}
              onSubmit={({ action, method, data: formData }) => {
                setIsSubmitted(true);
                submitLogin({
                  action,
                  method,
                  body: Object.fromEntries(formData),
                });
              }}
            />
          )}
          {isInitializing && (
            <Box p={6} textAlign="center">
              <Spinner thickness="5px" color="blue.600" size="xl" />
            </Box>
          )}
          <SelfServiceUiMessageList mt={3} messages={data?.ui?.messages} />
          {isLoggedIn === false && (
            <Box
              key="other-options"
              mt={8}
              pt={6}
              borderTopColor="gray.600"
              borderTopStyle="solid"
              borderTopWidth={1}
            >
              <Link as={RouterLink} to="/auth/recovery">
                Forgot your password?
              </Link>

              <Text mt={2}>
                Don't have an account yet?{" "}
                <Link as={RouterLink} to="/auth/registration">
                  Sign up!
                </Link>
              </Text>
            </Box>
          )}
        </Card>
      )}
    </Container>
  );
};
