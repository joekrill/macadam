import { RootState } from "../../../app/store";

export const selectDeviceLocale = (state: RootState) => state.i18n.deviceLocale;
