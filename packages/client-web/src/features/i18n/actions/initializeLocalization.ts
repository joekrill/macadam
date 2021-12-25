import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { DEFAULT_LOCALE, deviceLocaleToken, LocaleCode } from "../constants";
import { loadLocale } from "../loadLocale";
import { loadBasePolyfills } from "../polyfills/loadBasePolyfills";
import { selectDeviceLocale } from "../selectors/selectDeviceLocale";
import { selectSelectedLocale } from "../selectors/selectSelectedLocale";

/**
 * Loads any necessary polyfills needed for i18n.
 */
export const initializeLocalization = createAsyncThunk<
  LocaleCode,
  void,
  {
    state: RootState;
  }
>("i18n/initializeLocalization", async (_, { getState }) => {
  const state = getState();
  const selectedLocale = selectSelectedLocale(state);
  const deviceLocale = selectDeviceLocale(state);
  const activeLocale =
    selectedLocale === deviceLocaleToken ? deviceLocale : selectedLocale;

  await loadBasePolyfills();

  await Promise.all([
    loadLocale(DEFAULT_LOCALE),
    activeLocale === DEFAULT_LOCALE
      ? Promise.resolve()
      : loadLocale(activeLocale),
  ]);

  return activeLocale;
});
