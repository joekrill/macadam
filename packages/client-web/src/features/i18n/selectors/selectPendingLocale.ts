import { RootState } from "../../../app/store";

export const selectPendingLocale = ({ i18n }: RootState) => i18n.pendingLocale;
