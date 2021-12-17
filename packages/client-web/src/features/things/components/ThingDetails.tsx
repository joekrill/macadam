import { Box, chakra, Heading, Icon, Spinner, Text } from "@chakra-ui/react";
import { skipToken } from "@reduxjs/toolkit/query";
import { parseISO } from "date-fns";
import { FaLock, FaUnlock } from "react-icons/fa";
import { FormattedDate, FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";
import { thingsApi } from "../thingsApi";
import { ThingLoadError } from "./ThingLoadError";

export const ThingDetails = () => {
  const { id } = useParams<"id">();
  const { data, error, isFetching, refetch } = thingsApi.useGetThingQuery(
    id || skipToken
  );

  return (
    <Box>
      {error && <ThingLoadError error={error} refetch={refetch} />}
      {data && (
        <Box>
          <Heading>
            {data.data.name}{" "}
            <Icon
              h="1rem"
              w="1rem"
              as={data?.data.isPrivate ? FaLock : FaUnlock}
              color={data?.data.isPrivate ? "red.600" : "green.300"}
            />
          </Heading>
          <Text>{data.data?.description}</Text>
          <Text>
            <chakra.span color="gray.500">
              <FormattedMessage
                id="thingDetails.createdField.label"
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
                id="thingDetails.updatedField.label"
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
