import "react-table";

/**
 * To add additional react-table hook plugin support,
 * @see {@link https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table#example-type-file}
 */

declare module "react-table" {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UseSortByOptions<D>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  export interface Hooks<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseSortByHooks<D> {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseSortByInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseSortByState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseSortByColumnOptions<D> {
    isNumeric?: boolean; // matches Chakra's isNumeric prop for Th elements
    textAlign?: CSS.Property.TextAlign;
    noOfLines?: number;
  }

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseSortByColumnProps<D> {}

  // export interface Cell<
  //   D extends Record<string, unknown> = Record<string, unknown>,
  //   V = any
  // > {}

  // export interface Row<
  //   D extends Record<string, unknown> = Record<string, unknown>
  // > {}
}
