import { Box, chakra, Heading, Icon, Spinner, Text } from "@chakra-ui/react";
import { thingsApi } from "@macadam/api-client";
import { skipToken } from "@reduxjs/toolkit/query";
import { parseISO } from "date-fns";
import { FaLock, FaUnlock } from "react-icons/fa";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { ThingActions } from "./ThingActions";
import { ThingLoadError } from "./ThingLoadError";

export const ThingDetails = () => {
  const { id } = useParams<"id">();
  const navigate = useNavigate();
  const { data, error, isFetching, refetch } = thingsApi.useGetThingQuery(
    id || skipToken
  );

  return (
    <Box>
      {error && <ThingLoadError error={error} refetch={refetch} />}
      {data && (
        <Box>
          <Heading>
            <chakra.span>{data.data.name} </chakra.span>
            <Icon
              h="1rem"
              w="1rem"
              as={data.data.isPublic ? FaUnlock : FaLock}
              color={data.data.isPublic ? "green.300" : "red.600"}
            />
            <ThingActions
              ml="3"
              size="xs"
              thing={data.data}
              onDelete={() => {
                navigate("/things");
              }}
            />
          </Heading>
          <Text>{data.data?.description}</Text>
          <Text>
            <chakra.span color="gray.500">
              <FormattedMessage
                id="things.thingDetails.createdField.label"
                defaultMessage="Created:"
              />
            </chakra.span>
            <FormattedDate
              dateStyle="full"
              value={parseISO(data.data.createdAt)}
            />
          </Text>
          <Text>
            <chakra.span color="gray.500">
              <FormattedMessage
                id="things.thingDetails.updatedField.label"
                defaultMessage="Updated:"
              />
            </chakra.span>{" "}
            <FormattedDate
              dateStyle="full"
              value={parseISO(data.data.updatedAt)}
            />
          </Text>
        </Box>
      )}
      {isFetching && <Spinner />}
    </Box>
  );
};
