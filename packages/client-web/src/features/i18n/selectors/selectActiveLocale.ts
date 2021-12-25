import { RootState } from "../../../app/store";

export const selectActiveLocale = (state: RootState) => state.i18n.activeLocale;
