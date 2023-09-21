import { Icon } from "@chakra-ui/react";
import { Thing } from "@macadam/api-client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { useMemo } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { FormattedDate, useIntl } from "react-intl";
import {
  DataTable,
  DataTableProps,
} from "../../common/components/DataTable/DataTable";
import { RouterLink } from "../../routing/components/RouterLink";
import { ThingActions } from "./ThingActions";

export type ThingsTableProps = Partial<DataTableProps<Thing>>;

const columnHelper = createColumnHelper<Thing>();

export const ThingsTable = ({ data = [], ...props }: ThingsTableProps) => {
  const { formatMessage } = useIntl();
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: formatMessage({
          id: "things.thingsTable.nameHeader.label",
          defaultMessage: "Name",
        }),
        cell: (info) => (
          <RouterLink to={`/things/${info.row.original.id}`}>
            {info.getValue()}
          </RouterLink>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("description", {
        header: formatMessage({
          id: "things.thingsTable.descriptionHeader.label",
          defaultMessage: "Description",
        }),
        // cell: (info) => <RouterLink to={`/things/${info.row.original.id}`}>{info.getValue()}</RouterLink>,
        // enableSorting: true,
      }),
      columnHelper.accessor("createdAt", {
        header: formatMessage({
          id: "things.thingsTable.createdHeader.label",
          defaultMessage: "Created",
        }),
        cell: (info) => (
          <FormattedDate
            dateStyle="full"
            timeStyle="medium"
            value={parseISO(info.getValue())}
          />
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("isPublic", {
        header: formatMessage({
          id: "things.thingsTable.publicHeader.label",
          defaultMessage: "Public",
        }),
        cell: (info) => (
          <Icon
            boxSize="1em"
            as={info.getValue() ? FaUnlock : FaLock}
            color={info.getValue() ? "green.300" : "red.600"}
          />
        ),
        enableSorting: true,
        meta: {
          textAlign: "center",
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <ThingActions
            size="sm"
            colorScheme="blue"
            thing={info.row.original}
          />
        ),
        enableSorting: false,
      }),
    ],
    [formatMessage],
  );

  return (
    <DataTable
      {...props}
      data={data}
      columns={columns as ColumnDef<Thing, any>[]}
    />
  );
};
