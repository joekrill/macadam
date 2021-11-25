import { RootState } from "../../../app/store";

export const selectPendingLocale = (state: RootState) =>
  state?.i18n.pendingLocale;
