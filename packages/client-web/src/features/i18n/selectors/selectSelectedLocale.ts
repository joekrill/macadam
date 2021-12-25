import { RootState } from "../../../app/store";

export const selectSelectedLocale = (state: RootState) =>
  state.i18n.selectedLocale;
