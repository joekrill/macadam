import { Box, Heading } from "@chakra-ui/react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../../common/components/LoadingSpinner/LoadingSpinner";
import { thingsApi } from "../thingsApi";
import { ThingForm } from "./ThingForm";
import { ThingLoadError } from "./ThingLoadError";

export const ThingEdit = () => {
  const { id } = useParams<"id">();
  const getResult = thingsApi.useGetThingQuery(id || skipToken);

  const navigate = useNavigate();
  const [submit, updateResult] = thingsApi.useUpdateThingMutation();

  useEffect(() => {
    if (updateResult.isSuccess) {
      navigate(`/things/${updateResult.data.data.id}`);
    }
  }, [updateResult, navigate]);

  return (
    <Box>
      <Heading mb="2">
        <FormattedMessage id="thingEdit.title" defaultMessage="Edit Thing" />
      </Heading>
      {getResult.isFetching && <LoadingSpinner />}
      {getResult.error && <ThingLoadError error={getResult.error} />}
      {!id && <ThingLoadError error={404} />}
      {getResult.data && (
        <ThingForm
          isLoading={updateResult.isLoading}
          defaultValues={getResult.data.data}
          onSubmit={(thing) => submit({ id: id!, ...thing })}
          error={updateResult.error}
        />
      )}
    </Box>
  );
};
