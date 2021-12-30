import { Icon } from "@chakra-ui/react";
import { parseISO } from "date-fns";
import { useMemo } from "react";
import { FaAsterisk } from "react-icons/fa";
import { FormattedDate, useIntl } from "react-intl";
import { Column } from "react-table";
import {
  DataTable,
  DataTableProps,
} from "../../common/components/DataTable/DataTable";
import { useSession } from "../hooks/useSession";
import { SessionWithoutIdentity } from "../schemas/session";
import { SessionActions } from "./SessionActions";

export interface SessionsTableProps
  extends Partial<DataTableProps<SessionWithoutIdentity>> {}

export const SessionsTable = ({ data = [], ...props }: SessionsTableProps) => {
  const { formatMessage } = useIntl();
  const { session } = useSession();
  const currentSessionId = session?.id;

  const columns = useMemo<Column<SessionWithoutIdentity>[]>(
    () => [
      {
        Header: formatMessage({
          id: "auth.sessionsTable.authenticatedAtHeader.label",
          defaultMessage: "Last Used",
        }),
        accessor: "authenticated_at",
        Cell: ({ value }) =>
          value && (
            <FormattedDate
              dateStyle="full"
              timeStyle="medium"
              value={parseISO(value)}
            />
          ),
      },
      {
        Header: formatMessage({
          id: "auth.sessionsTable.expiresAtHeader.label",
          defaultMessage: "Expires",
        }),
        accessor: "expires_at",
        Cell: ({ value }) =>
          value && (
            <FormattedDate
              dateStyle="full"
              timeStyle="medium"
              value={parseISO(value)}
            />
          ),
      },
      {
        Header: formatMessage({
          id: "auth.sessionsTable.methodHeader.label",
          defaultMessage: "Method",
        }),
        accessor: "authentication_methods",
        Cell: ({ value }) => value?.map(({ method }) => method).join(", "),
      },
      {
        accessor: "active",
        disableSortBy: true,
        Cell: ({ row }) => (
          <SessionActions size="sm" colorScheme="blue" session={row.original} />
        ),
      },
      {
        accessor: "id",
        disableSortBy: true,
        Cell: ({ value }) =>
          value === currentSessionId && (
            <Icon
              color="green.500"
              boxSize="0.75em"
              as={FaAsterisk}
              title={formatMessage({
                id: "auth.sessionsTable.currentSessionIndicator.title",
                defaultMessage: "This is your current session",
              })}
            />
          ),
      },
    ],
    [formatMessage, currentSessionId]
  );

  return <DataTable {...props} data={data} columns={columns} />;
};
