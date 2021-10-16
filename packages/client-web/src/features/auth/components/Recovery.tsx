import { Box, Container, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "../../common/components/Card/Card";
import { ErrorAlert } from "../../errors/components/ErrorAlert";
import { identityApi } from "../identityApi";
import { SelfServiceUiForm } from "./SelfServiceUiForm";
import { SelfServiceUiMessageList } from "./SelfServiceUiMessageList";

export const Recovery = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const flowId = params.get("flow");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const verificationFlowQuery = identityApi.useGetRecoveryFlowQuery(flowId);
  const [submitRecovery, result] = identityApi.useSubmitRecoveryFlowMutation();

  const isLoading = isSubmitted
    ? result.isLoading
    : verificationFlowQuery.isLoading;
  const error = isSubmitted ? result.error : verificationFlowQuery.error;
  const data = (isSubmitted && result.data) || verificationFlowQuery.data;

  // TODO: if logged in redirect to settings? Or show error?

  return (
    <Card as={Container} maxW="container.sm">
      {error && !isLoading && (
        <ErrorAlert
          mt={4}
          onRetryClick={() => {
            verificationFlowQuery.refetch();
            setIsSubmitted(false);
          }}
        />
      )}
      {data?.ui && data?.state === "choose_method" && (
        <SelfServiceUiForm
          ui={data.ui}
          isSubmitting={result.isLoading}
          onSubmit={({ action, method, data }) => {
            submitRecovery({
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
