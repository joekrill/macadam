import { Icon } from "@chakra-ui/react";
import { Thing } from "@macadam/api-client";
import { parseISO } from "date-fns";
import { useMemo } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { FormattedDate, useIntl } from "react-intl";
import { Column } from "react-table";
import {
  DataTable,
  DataTableProps,
} from "../../common/components/DataTable/DataTable";
import { RouterLink } from "../../routing/components/RouterLink";
import { ThingActions } from "./ThingActions";

export type ThingsTableProps = Partial<DataTableProps<Thing>>;

export const ThingsTable = ({ data = [], ...props }: ThingsTableProps) => {
  const { formatMessage } = useIntl();
  const columns = useMemo<Column<Thing>[]>(
    () => [
      {
        Header: formatMessage({
          id: "things.thingsTable.nameHeader.label",
          defaultMessage: "Name",
        }),
        accessor: "name",
        Cell: ({ value, row }) => (
          <RouterLink to={`/things/${row.original.id}`}>{value}</RouterLink>
        ),
      },
      {
        Header: formatMessage({
          id: "things.thingsTable.descriptionHeader.label",
          defaultMessage: "Description",
        }),
        accessor: "description",
      },
      {
        Header: formatMessage({
          id: "things.thingsTable.createdHeader.label",
          defaultMessage: "Created",
        }),
        accessor: "createdAt",
        Cell: ({ value }) => (
          <FormattedDate
            dateStyle="full"
            timeStyle="medium"
            value={parseISO(value)}
          />
        ),
      },
      {
        Header: formatMessage({
          id: "things.thingsTable.publicHeader.label",
          defaultMessage: "Public",
        }),
        accessor: "isPublic",
        textAlign: "center",
        Cell: ({ value }) => (
          <Icon
            boxSize="1em"
            as={value ? FaUnlock : FaLock}
            color={value ? "green.300" : "red.600"}
          />
        ),
      },
      {
        accessor: "id",
        disableSortBy: true,
        Cell: ({ row }) => (
          <ThingActions size="sm" colorScheme="blue" thing={row.original} />
        ),
      },
    ],
    [formatMessage]
  );

  return <DataTable {...props} data={data} columns={columns} />;
};
