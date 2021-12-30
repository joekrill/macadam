import { Box, Heading, IconButton } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as ReactRouterLink } from "react-router-dom";
import { ErrorAlert } from "../../errors/components/ErrorAlert/ErrorAlert";
import { Pagination } from "../../pagination/components/Pagination/Pagination";
import { usePageUrlParam } from "../../pagination/hooks/usePageUrlParam";
import { useSortByUrlParam } from "../../sorting/hooks/useSortByUrlParam";
import { authApi } from "../authApi";
import { useSession } from "../hooks/useSession";
import { SessionWithoutIdentity } from "../schemas/session";
import { SessionsTable } from "./SessionsTable";

export const SessionsList = () => {
  const { formatMessage } = useIntl();
  const { isLoggedIn } = useSession();
  const { page, getPageTo } = usePageUrlParam();
  const {
    setRules,
    rules,
    paramValue: sort,
  } = useSortByUrlParam<SessionWithoutIdentity>();

  const { data, isFetching, error, refetch } = authApi.useListSessionsQuery(
    {
      page,
      sort,
    },
    { skip: !isLoggedIn }
  );

  return (
    <Box>
      <Heading mb="2">
        <FormattedMessage
          id="auth.sessionsList.title"
          defaultMessage="Sessions"
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
