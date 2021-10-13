import { Box, Container, Link, Spinner, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { z } from "zod";
import { Card } from "../../common/components/Card/Card";
import { ErrorAlert } from "../../errors/components/ErrorAlert";
import { useLoginReturnToLocation } from "../hooks/useLoginReturnToLocation";
import { useSession } from "../hooks/useSession";
import { identityApi } from "../identityApi";
import {
  isSelfServiceLoginFlow,
  isSelfServiceLoginFlowSuccess,
} from "../schemas/flows/login";
import { LoggedInNotice } from "./LoggedInNotice";
import { SelfServiceUiForm } from "./SelfServiceUiForm";
import { SelfServiceUiMessageList } from "./SelfServiceUiMessageList";

const redirectStateSchema = z.object({
  pathname: z.string().refine((pathname) => !pathname.startsWith("/auth")),
  search: z.string().optional(),
  state: z.unknown().optional(),
  hash: z.string().optional(),
  key: z.string().optional(),
});

export function isValidRedirect(
  location: unknown
): location is z.infer<typeof redirectStateSchema> {
  return redirectStateSchema.safeParse(location).success;
}

export const Login = () => {
  const session = useSession();
  const history = useHistory();
  const returnTo = useLoginReturnToLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loginFlowQuery = identityApi.useInitializeLoginFlowQuery(undefined, {
    // Force a new flow to be initialized whenever the form is recreated.
    refetchOnMountOrArgChange: true,

    // Don't initialize the query unless we have determined we aren't logged in already,
    // otherwise we'd create a flow that will never be used.
    skip: session.isLoggedIn !== false,
  });
  const [submitLogin, submitResult] = identityApi.useSubmitLoginFlowMutation();

  const isInitializing = session.isUnknown || loginFlowQuery.isLoading;
  const isLoading = isInitializing || submitResult.isLoading;

  const data =
    (isSubmitted &&
      isSelfServiceLoginFlow(submitResult.data) &&
      submitResult.data) ||
    loginFlowQuery.data;
  const error = (isSubmitted && submitResult.error) || loginFlowQuery.error;

  const restart = useCallback(() => {
    loginFlowQuery.refetch();
    setIsSubmitted(false);
  }, [loginFlowQuery, setIsSubmitted]);

  return (
    <Container maxW="container.sm">
      {session.isLoggedIn && !isSubmitted ? (
        <LoggedInNotice onLogout={() => restart()} />
      ) : (
        <Card>
          {error && !isLoading && <ErrorAlert onRetryClick={() => restart()} />}
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
                }).then((result) => {
                  if (
                    "data" in result &&
                    isSelfServiceLoginFlowSuccess(result.data)
                  ) {
                    history.push(returnTo);
                  }
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
          {session.isLoggedIn === false && (
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
