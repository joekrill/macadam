import { RootState } from "../../../app/store";

export const selectLastError = ({ i18n }: RootState) => i18n.lastError;
