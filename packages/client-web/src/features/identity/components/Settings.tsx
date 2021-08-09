import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "../../common/components/Card/Card";
import { identityApi } from "../identityApi";
import { SelfServiceUiForm } from "./SelfServiceUiForm";
import { SelfServiceUiMessageList } from "./SelfServiceUiMessageList";

export const Settings = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const flowId = params.get("flow");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const settingsFlowQuery = identityApi.useGetSettingsFlowQuery(flowId);
  const [submitSettings, result] = identityApi.useSubmitSettingsFlowMutation();

  const isLoading = isSubmitted
    ? result.isLoading
    : settingsFlowQuery.isLoading;
  const error = isSubmitted ? result.error : settingsFlowQuery.error;
  const data = (isSubmitted && result.data) || settingsFlowQuery.data;

  // TODO: Deal with updating settings that are "privileged".
  // The docs (currently) state (https://www.ory.sh/kratos/docs/self-service/flows/user-settings) that:
  // > This end-user experience currently works only for Browser-based Settings Flows. API-based flows will simply return a 403 Forbidden status message which require you to request a new Ory Kratos Login session using the API-based Login Flow.
  // But we should be able to check for that and prompt for the user's password in a modal?

  return (
    <Card as={Container} maxW="container.sm">
      {error && !isLoading && (
        <Alert
          status="error"
          mt={4}
          displa="flex"
          justifyContent="space-between"
        >
          <Flex>
            <AlertIcon />
            Something went wrong :(
          </Flex>
          <Button
            colorScheme="red"
            onClick={() => {
              settingsFlowQuery.refetch();
              setIsSubmitted(false);
            }}
          >
            Try again
          </Button>
        </Alert>
      )}
      {data?.ui /*&& data?.state === "show_form" */ && (
        <SelfServiceUiForm
          ui={data.ui}
          isSubmitting={result.isLoading}
          onSubmit={({ action, method, data }) => {
            submitSettings({
              action,
              method,
              body: Object.fromEntries(data),
            });
            setIsSubmitted(true);
          }}
        />
      )}
      {isLoading && (
        <Box p={6} textAlign="center">
          <Spinner thickness="5px" color="blue.600" size="xl" />
        </Box>
      )}
      <SelfServiceUiMessageList mt={3} messages={data?.ui?.messages} />
    </Card>
  );
};
