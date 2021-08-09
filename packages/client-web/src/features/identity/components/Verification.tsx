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

export const Verification = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const flowId = params.get("flow");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const verificationFlowQuery = identityApi.useGetVerificationFlowQuery(flowId);
  const [submitVerification, result] =
    identityApi.useSubmitVerificationFlowMutation();

  const isLoading = isSubmitted
    ? result.isLoading
    : verificationFlowQuery.isLoading;
  const error = isSubmitted ? result.error : verificationFlowQuery.error;
  const data = (isSubmitted && result.data) || verificationFlowQuery.data;

  // TODO: if logged in and not verified, auto-populate email address?
  // TODO: if logged in and verified, show message instead of flow?

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
              verificationFlowQuery.refetch();
              setIsSubmitted(false);
            }}
          >
            Try again
          </Button>
        </Alert>
      )}
      {data?.ui && data?.state === "choose_method" && (
        <SelfServiceUiForm
          ui={data.ui}
          isSubmitting={result.isLoading}
          onSubmit={({ action, method, data }) => {
            submitVerification({
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
