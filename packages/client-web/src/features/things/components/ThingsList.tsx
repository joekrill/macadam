import {
  Box,
  Heading,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { HiRefresh } from "react-icons/hi";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { Pagination } from "../../common/components/Pagination/Pagination";
import { ErrorAlert } from "../../errors/components/ErrorAlert/ErrorAlert";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { thingsApi } from "../thingsApi";
import { ThingsTable } from "./ThingsTable";

export const ThingsList = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const params = useUrlSearchParams();
  const pageParam = params.get("page");
  const page = useMemo(
    () => (pageParam && parseInt(pageParam, 10)) || 1,
    [pageParam]
  );
  const owned = params.has("mine");

  const { data, isFetching, error, refetch } = thingsApi.useListThingsQuery({
    page,
    owned,
  });

  return (
    <Box>
      <Heading mb="2">
        <FormattedMessage id="thingsList.title" defaultMessage="Things" />
        <IconButton
          ml="3"
          isRound
          aria-label={formatMessage({
            id: "thingsList.refreshButton.ariaLabel",
            defaultMessage: "Refresh",
          })}
          icon={<HiRefresh />}
          onClick={refetch}
          isLoading={isFetching}
        />{" "}
      </Heading>
      <Box>
        <RadioGroup
          onChange={(value) => {
            const newParams = new URLSearchParams(params);
            if (value === "mine") {
              newParams.set("mine", "1");
            } else {
              newParams.delete("mine");
            }
            newParams.delete("page");
            navigate(`/things/?${newParams.toString()}`);
          }}
          value={owned ? "mine" : "all"}
        >
          <Stack direction="row">
            <Radio value="all">
              <FormattedMessage
                id="thingsFilter.allThings.label"
                defaultMessage="All the things"
              />
            </Radio>
            <Radio value="mine">
              <FormattedMessage
                id="thingsFilter.myThings.label"
                defaultMessage="My things"
              />
            </Radio>
          </Stack>
        </RadioGroup>
      </Box>
      {error && <ErrorAlert my="5" onRetryClick={refetch} error={error} />}
      {data && <ThingsTable data={data.data} />}
      {data && (
        <Pagination
          p="3"
          buttonProps={(page) => {
            const linkParams = new URLSearchParams(params);
            linkParams.set("page", String(page));

            return {
              as: ReactRouterLink,
              to: `/things/?${linkParams.toString()}`,
            };
          }}
          currentPage={data?.pagination.page || page}
          totalPages={data?.pagination.totalPages}
        />
      )}
    </Box>
  );
};
