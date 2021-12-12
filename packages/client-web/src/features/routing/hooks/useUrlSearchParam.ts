import { useUrlSearchParams } from "./useUrlSearchParams";

export const useUrlSearchParam = (param: string, defaultValue?: string) =>
  useUrlSearchParams().get(param) || defaultValue;
