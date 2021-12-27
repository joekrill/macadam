import { Box, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { thingsApi } from "../thingsApi";
import { ThingForm } from "./ThingForm";

export const ThingCreate = () => {
  const navigate = useNavigate();
  const [submit, { error, isLoading, isSuccess, data }] =
    thingsApi.useCreateThingMutation();

  useEffect(() => {
    if (isSuccess && data?.data.id) {
      navigate(`/things/${data.data.id}`);
    }
  }, [isSuccess, data, navigate]);

  return (
    <Box>
      <Heading mb="2">
        <FormattedMessage
          id="things.thingCreate.title"
          defaultMessage="New Thing"
        />
      </Heading>
      <ThingForm isLoading={isLoading} onSubmit={submit} error={error} />
    </Box>
  );
};
