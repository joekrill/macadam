import { Box, Container, Link, Spinner, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Card } from "../../common/components/Card/Card";
import { useRegistrationFlow } from "../hooks/useRegistrationFlow";
import { useSession } from "../hooks/useSession";
import { UiText } from "../schemas/ui";
import { FlowError } from "./FlowError";
import { LoggedInNotice } from "./LoggedInNotice";
import { SelfServiceUiForm } from "./SelfServiceUiForm";
import { SelfServiceUiMessage } from "./SelfServiceUiMessage";

export const Registration = () => {
  const { isLoggedIn, username } = useSession();
  const { error, ui, submit, isLoading, isSuccess, isSubmitting, restart } =
    useRegistrationFlow();

  if (isLoggedIn && !isSuccess) {
    return (
      <Container maxW="container.sm">
        <LoggedInNotice onLogout={() => restart()} />
      </Container>
    );
  }

  return (
    <Card as={Container} maxW="container.sm">
      {error && !isLoading && <FlowError onRetry={() => restart()} />}
      {ui && (
        <SelfServiceUiForm
          ui={ui}
          isSubmitting={isSubmitting}
          onSubmit={({ action, method, data }) => {
            submit({
              action,
              method,
              body: Object.fromEntries(data),
            });
          }}
        />
      )}
      {isLoading && (
        <Box p={6} textAlign="center">
          <Spinner thickness="5px" color="blue.600" size="xl" />
        </Box>
      )}
      {ui && (
        <Box mt={3}>
          {ui.messages?.map((message: UiText) => (
            <SelfServiceUiMessage key={message.id} message={message} />
          ))}
        </Box>
      )}
      {isLoggedIn === false && (
        <Box
          key="other-options"
          mt={8}
          pt={6}
          borderTopColor="gray.600"
          borderTopStyle="solid"
          borderTopWidth={1}
        >
          <Text mt={2}>
            Already have an account?{" "}
            <Link as={RouterLink} to="/auth/login">
              Log in
            </Link>
          </Text>
        </Box>
      )}
    </Card>
  );
};
