import { RootState } from "../../../app/store";

export const selectCurrentLocale = (state: RootState) =>
  state.i18n.currentLocale;
