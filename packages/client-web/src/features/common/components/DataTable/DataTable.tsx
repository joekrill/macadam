import {
  chakra,
  Icon,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
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
  const controlledState = useCallback(
    (state: TableState<D>) => ({
      ...state,
      sortBy: sortBy || [],
    }),
    [sortBy]
  );

  const stateReducer = useCallback(
    (newState: TableState<D>, action: ActionType) => {
      console.log("action:" + action.type, { action, newState });

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
    [onSortByChange]
  );

  const {
    getTableProps,
    getTableBodyProps,
    footerGroups,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<D>(
    {
      useControlledState: controlledState,
      disableMultiSort,
      disableSortRemove,
      manualSortBy,
      stateReducer,
      ...props,
    },
    useSortBy
  );

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render("Header")}
                {column.canSort && (
                  <chakra.span pl="4">
                    {column.isSorted && (
                      <Icon
                        as={column.isSortedDesc ? FaChevronDown : FaChevronUp}
                        aria-label="sorted descending"
                      />
                    )}
                  </chakra.span>
                )}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
      {footerGroups.length > 0 && (
        <Tfoot>
          {footerGroups.map((footerGroup) => (
            <Tr {...footerGroup.getFooterGroupProps()}>
              {footerGroup.headers.map((column) => (
                <Td {...column.getFooterProps()} isNumeric={column.isNumeric}>
                  {column.render("Footer")}
                </Td>
              ))}
            </Tr>
          ))}
        </Tfoot>
      )}
    </Table>
  );
};
