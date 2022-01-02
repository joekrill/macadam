import { Container } from "@chakra-ui/react";
import { SerializedError } from "@reduxjs/toolkit";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useMemo } from "react";
import { LoadingSpinner } from "../../common/components/LoadingSpinner/LoadingSpinner";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { FlowErrorAlert } from "../components/flows/FlowErrorAlert";
import { identityApi } from "../identityApi";

export const FlowErrorPage = () => {
  const params = useUrlSearchParams();
  const errorId = params.get("id");
  const { isLoading, data } = identityApi.useGetFlowErrorQuery(
    errorId || skipToken
  );

  const flowError = useMemo(() => ({ data } as SerializedError), [data]);

  return (
    <Container maxW="container.md" overflow="auto">
      {isLoading && <LoadingSpinner />}
      {data && <FlowErrorAlert error={flowError} />}
    </Container>
  );
};
