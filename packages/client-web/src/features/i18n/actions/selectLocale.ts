import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { deviceLocaleToken, DeviceLocaleToken, LocaleCode } from "../constants";
import { loadLocale } from "../loadLocale";
import { storeSelectedLocale } from "../localeStorage";
import { selectDeviceLocale } from "../selectors/selectDeviceLocale";

/**
 * Updates the currently selected locale and loads it's messages if needed.
 */
export const selectLocale = createAsyncThunk<
  LocaleCode,
  LocaleCode | DeviceLocaleToken,
  {
    state: RootState;
  }
>("i18n/selectLocale", async (locale, { getState }) => {
  const localeCode =
    locale === deviceLocaleToken ? selectDeviceLocale(getState()) : locale;
  await loadLocale(localeCode);
  storeSelectedLocale(locale);
  return localeCode;
});
