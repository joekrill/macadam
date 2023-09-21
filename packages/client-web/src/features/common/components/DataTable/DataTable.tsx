import {
  chakra,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowData,
  SortingState,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useIntl } from "react-intl";

export type DataTableProps<TData extends RowData> = Pick<
  TableOptions<TData>,
  "columns" | "data"
> & {
  columns: ColumnDef<TData>[];
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
};

export const DataTable = <TData extends object>({
  columns,
  data,
  onSortingChange,
  sorting,
}: DataTableProps<TData>) => {
  const { formatMessage } = useIntl();
  const handleSortingChange = useCallback<OnChangeFn<SortingState>>(
    (newSorting) => {
      if (!onSortingChange) {
        return;
      }

      if (typeof newSorting === "function") {
        onSortingChange(newSorting(sorting || []));
      } else {
        onSortingChange(newSorting);
      }
    },
    [onSortingChange, sorting],
  );

  const table = useReactTable<TData>({
    columns,
    data,
    state: {
      sorting,
    },
    enableSorting: onSortingChange !== undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    debugTable: true,
  });

  const bgEvenColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Table borderWidth="1px">
      <Thead bg={useColorModeValue("gray.200", "gray.600")}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                cursor={header.column.getCanSort() ? "pointer" : "auto"}
                textAlign={header.column.columnDef.meta?.textAlign}
              >
                <chakra.div noOfLines={1}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {header.column.getCanSort() && (
                    <chakra.span pl="4">
                      <Icon
                        visibility={
                          header.column.getIsSorted() ? "visible" : "hidden"
                        }
                        as={
                          header.column.getIsSorted() === "desc"
                            ? FaChevronDown
                            : FaChevronUp
                        }
                        aria-label={formatMessage(
                          {
                            id: "common.dataTable.sortHeader.ariaLabel",
                            defaultMessage:
                              "{sort, select, asc {Sorted ascending} desc {Sorted descending} other {Not sorted}}",
                            description:
                              "The screen reader hint to show for the sort indicator in the table header",
                          },
                          {
                            sort: header.column.getIsSorted() ?? "",
                          },
                        )}
                      />
                    </chakra.span>
                  )}
                </chakra.div>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id} _even={{ bg: bgEvenColor }}>
            {row.getVisibleCells().map((cell) => (
              <Td
                key={cell.id}
                textAlign={cell.column.columnDef.meta?.textAlign}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
