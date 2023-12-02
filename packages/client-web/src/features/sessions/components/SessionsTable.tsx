import { Icon } from "@chakra-ui/react";
import { ApiSession, useSession } from "@macadam/api-client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { useMemo } from "react";
import { FaAsterisk } from "react-icons/fa";
import { FormattedDate, useIntl } from "react-intl";
import {
  DataTable,
  DataTableProps,
} from "../../common/components/DataTable/DataTable";
import { SessionActions } from "./SessionActions";

export interface SessionsTableProps
  extends Partial<DataTableProps<ApiSession>> {}

const columnHelper = createColumnHelper<ApiSession>();

export const SessionsTable = ({ data = [], ...props }: SessionsTableProps) => {
  const { formatMessage } = useIntl();
  const { session } = useSession();
  const currentSessionId = session?.id;

  const columns = useMemo(
    () => [
      columnHelper.accessor("authenticated_at", {
        header: formatMessage({
          id: "auth.sessionsTable.authenticatedAt.columnHeading",
          description:
            "The heading text for the column showing the last used time and date for a session",
          defaultMessage: "Last Used",
        }),
        cell: (info) => {
          const value = info.getValue();
          return value ? (
            <FormattedDate
              dateStyle="full"
              timeStyle="medium"
              value={parseISO(value)}
            />
          ) : null;
        },
        enableSorting: true,
      }),
      columnHelper.accessor("expires_at", {
        header: formatMessage({
          id: "auth.sessionsTable.expiresAt.columnHeading",
          description:
            "The heading text for the column showing when a session expires.",
          defaultMessage: "Expires",
        }),
        cell: (info) => {
          const value = info.getValue();
          return value ? (
            <FormattedDate
              dateStyle="full"
              timeStyle="medium"
              value={parseISO(value)}
            />
          ) : null;
        },
        enableSorting: true,
      }),
      columnHelper.accessor("authentication_methods", {
        header: formatMessage({
          id: "auth.sessionsTable.method.columnHeading",
          description:
            "The heading text for the column showing the authentication method used for a session.",
          defaultMessage: "Method",
        }),
        cell: (info) => (
          <>
            {info
              .getValue()
              ?.map(({ method }) => method)
              .join(", ")}
          </>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("active", {
        header: "",
        cell: (info) => (
          <SessionActions
            size="sm"
            colorScheme="blue"
            session={info.row.original}
          />
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("id", {
        header: "",
        cell: (info) =>
          info.getValue() === currentSessionId ? (
            <Icon
              color="green.500"
              boxSize="0.75em"
              as={FaAsterisk}
              title={formatMessage({
                id: "auth.sessionsTable.currentSessionIndicator.tooltip",
                description:
                  "The tooltip/helper text shown when indicating that a particular session is the current session the user is authenticated with",
                defaultMessage: "This is your current session",
              })}
            />
          ) : null,
        enableSorting: false,
        meta: {
          textAlign: "right",
        },
      }),
    ],
    [formatMessage, currentSessionId],
  );

  return (
    <DataTable
      {...props}
      data={data}
      columns={columns as ColumnDef<ApiSession, unknown>[]}
    />
  );
};
