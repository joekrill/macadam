import { Box, Heading } from "@chakra-ui/react";
import { isNotFoundError, thingsApi } from "@macadam/api-client";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../../common/components/LoadingSpinner/LoadingSpinner";
import { NotFoundPage } from "../../errors/components/NotFoundPage/NotFoundPage";
import { useReturnToConsumer } from "../../routing/hooks/useReturnToConsumer";
import { ThingForm } from "./ThingForm";
import { ThingLoadError } from "./ThingLoadError";

export const ThingEdit = () => {
  const { id } = useParams<"id">();
  const getResult = thingsApi.useGetThingQuery(id || skipToken);

  const navigate = useNavigate();
  const [submit, { data, error, isLoading, isSuccess }] =
    thingsApi.useUpdateThingMutation();
  const returnTo = useReturnToConsumer() || `/things/${data?.data.id || ""}`;

  useEffect(() => {
    if (isSuccess) {
      navigate(returnTo);
    }
  }, [data, isSuccess, navigate, returnTo]);

  if (isNotFoundError(getResult.error)) {
    return <NotFoundPage />;
  }

  if (getResult.isUninitialized || getResult.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Heading mb="2">
        <FormattedMessage
          id="things.thingEdit.heading"
          description="The heading shown when editing a Thing"
          defaultMessage="Edit Thing"
        />
      </Heading>
      {getResult.isFetching && <LoadingSpinner />}
      {getResult.error && <ThingLoadError error={getResult.error} />}
      {!id && <ThingLoadError error={404} />}
      {getResult.data && (
        <ThingForm
          isLoading={isLoading}
          defaultValues={getResult.data.data}
          onSubmit={(thing) => submit({ id: id!, ...thing })}
          error={error}
        />
      )}
    </Box>
  );
};
