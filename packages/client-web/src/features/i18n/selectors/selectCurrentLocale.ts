import { RootState } from "../../../app/store";

export const selectCurrentLocale = ({ i18n }: RootState) => i18n.currentLocale;
