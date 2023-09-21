import type { TableCellProps } from "@chakra-ui/react";
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  export interface ColumnMeta<TData extends RowData, TValue> {
    textAlign?: TableCellProps["textAlign"];
  }
}
