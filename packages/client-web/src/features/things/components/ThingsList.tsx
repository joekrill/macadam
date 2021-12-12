import {
  Box,
  Heading,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../errors/components/ErrorAlert/ErrorAlert";
import { Pagination } from "../../pagination/components/Pagination/Pagination";
import {
  DEFAULT_PAGE_PARAM_NAME,
  usePageUrlParam,
} from "../../pagination/hooks/usePageUrlParam";
import { useUrlSearchParam } from "../../routing/hooks/useUrlSearchParam";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { useSortByUrlParam } from "../../sorting/hooks/useSortByUrlParam";
import { thingsApi } from "../thingsApi";
import { Thing } from "../thingsSchemas";
import { ThingsTable } from "./ThingsTable";

export const ThingsList = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const urlParams = useUrlSearchParams();
  const { page, getPageTo } = usePageUrlParam();
  const owned = !!useUrlSearchParam("mine");
  const { setRules, rules, paramValue: sort } = useSortByUrlParam<Thing>();

  const { data, isFetching, error, refetch } = thingsApi.useListThingsQuery({
    page,
    owned,
    sort,
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
            if (value === "mine") {
              urlParams.set("mine", "1");
            } else {
              urlParams.delete("mine");
            }
            urlParams.delete(DEFAULT_PAGE_PARAM_NAME);
            navigate(`/things/?${urlParams.toString()}`);
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
      {data && (
        <ThingsTable
          data={data.data}
          onSortByChange={setRules}
          sortBy={rules}
        />
      )}
      {data && (
        <Pagination
          p="3"
          buttonProps={(page) => ({
            as: ReactRouterLink,
            to: getPageTo(page),
          })}
          currentPage={page}
          totalPages={data?.pagination.totalPages}
        />
      )}
    </Box>
  );
};
