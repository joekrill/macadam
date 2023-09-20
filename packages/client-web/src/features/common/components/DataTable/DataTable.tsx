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
import { ReactNode, useCallback } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useIntl } from "react-intl";
import {
  ActionType,
  Column,
  SortingRule,
  TableOptions,
  TableState,
  useSortBy,
  useTable,
} from "react-table";

export interface DataTableProps<D extends object> extends TableOptions<D> {
  columns: Column<D>[];
  sortBy?: SortingRule<D>[];
  onSortByChange?: (sortBy: SortingRule<D>[]) => void;
}

export const DataTable = <D extends object>({
  disableMultiSort = true,
  disableSortRemove = true,
  manualSortBy = true,
  onSortByChange,
  sortBy,
  ...props
}: DataTableProps<D>) => {
  const { formatMessage } = useIntl();
  const controlledState = useCallback(
    (state: TableState<D>) => ({
      ...state,
      sortBy: sortBy || [],
    }),
    [sortBy],
  );

  const stateReducer = useCallback(
    (newState: TableState<D>, action: ActionType) => {
      if (!onSortByChange) {
        return newState;
      }
      if (action.type === "setSortBy") {
        onSortByChange(newState.sortBy);
      }

      if (action.type === "toggleSortBy") {
        onSortByChange(newState.sortBy);
      }

      return newState;
    },
    [onSortByChange],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<D>(
      {
        useControlledState: controlledState,
        disableMultiSort,
        disableSortRemove,
        manualSortBy,
        stateReducer,
        ...props,
      },
      useSortBy,
    );

  const bgEvenColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Table borderWidth="1px" {...getTableProps()}>
      <Thead bg={useColorModeValue("gray.200", "gray.600")}>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // eslint-disable-next-line react/jsx-key
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
                textAlign={column.textAlign}
              >
                <chakra.div noOfLines={1}>
                  {column.render("Header")}
                  {column.canSort && (
                    <chakra.span pl="4">
                      <Icon
                        visibility={column.isSorted ? "visible" : "hidden"}
                        as={column.isSortedDesc ? FaChevronDown : FaChevronUp}
                        aria-label={formatMessage(
                          {
                            id: "common.dataTable.sortHeader.ariaLabel",
                            defaultMessage:
                              "{sort, select, asc {Sorted ascending} desc {Sorted descending} other {Not sorted}}",
                            description:
                              "The screen reader hint to show for the sort indicator in the table header",
                          },
                          {
                            sort: column.isSorted
                              ? column.isSortedDesc
                                ? "desc"
                                : "asc"
                              : "",
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
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            // eslint-disable-next-line react/jsx-key
            <Tr {...row.getRowProps()} _even={{ bg: bgEvenColor }}>
              {row.cells.map((cell) => (
                // eslint-disable-next-line react/jsx-key
                <Td
                  {...cell.getCellProps()}
                  textAlign={cell.column.textAlign}
                  isNumeric={cell.column.isNumeric}
                  noOfLines={cell.column.noOfLines}
                >
                  {cell.render("Cell") as ReactNode}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
