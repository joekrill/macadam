import { Box, Heading, IconButton } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";
import { FormattedMessage, useIntl } from "react-intl";
import { useSession } from "../../auth/hooks/useSession";
import { ErrorAlert } from "../../errors/components/ErrorAlert/ErrorAlert";
import { Pagination } from "../../pagination/components/Pagination/Pagination";
import { usePageUrlParam } from "../../pagination/hooks/usePageUrlParam";
import { useSortByUrlParam } from "../../sorting/hooks/useSortByUrlParam";
import { sessionsApi } from "../sessionsApi";
import { ApiSession } from "../sessionsSchemas";
import { SessionsTable } from "./SessionsTable";

export const SessionsList = () => {
  const { formatMessage } = useIntl();
  const { isLoggedIn } = useSession();
  const { page, getPageTo } = usePageUrlParam();
  const { setRules, rules, paramValue: sort } = useSortByUrlParam<ApiSession>();

  const { data, isFetching, error, refetch } = sessionsApi.useListSessionsQuery(
    {
      page,
      sort,
    },
    { skip: !isLoggedIn }
  );

  return (
    <Box>
      <Heading mb="4" size="md">
        <FormattedMessage
          id="auth.sessionsList.title"
          defaultMessage="Active Sessions"
        />
        <IconButton
          ml="3"
          isRound
          size="sm"
          aria-label={formatMessage({
            id: "sessions.sessionsList.refreshButton.ariaLabel",
            defaultMessage: "Refresh",
          })}
          variant="outline"
          icon={<HiRefresh />}
          onClick={() => refetch()}
          isLoading={isFetching}
        />
      </Heading>
      {error && <ErrorAlert my="5" onRetryClick={refetch} error={error} />}
      {data && (
        <SessionsTable
          data={data.data}
          onSortByChange={setRules}
          sortBy={rules}
        />
      )}
      {data && (
        <Pagination
          p="3"
          useQueryStringPagination
          currentPage={page}
          totalPages={data?.pagination.totalPages}
        />
      )}
    </Box>
  );
};
