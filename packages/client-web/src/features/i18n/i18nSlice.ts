import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { initializeLocalization } from "./actions/initializeLocalization";
import { selectLocale } from "./actions/selectLocale";
import { DEFAULT_LOCALE, DeviceLocaleToken, LocaleCode } from "./constants";
import { getDevicePreferredLocale } from "./getDevicePreferredLocale";
import { getSelectedLocale } from "./localeStorage";

export interface I18nState {
  /**
   * Whether the i18n has been initialized (any necessary polyfills loaded for
   * the default locale)
   */
  isInitialized: boolean;

  /**
   * The locale currently being used/displayed in the application.
   */
  activeLocale: LocaleCode;

  /**
   * The closest matching supported locale based on the current devices
   * language preferences.
   */
  deviceLocale: LocaleCode;

  /**
   * When we are in the process of changing locales, the `pendingLocale` will be
   * set to the desired selected locale while we are loading the necessary
   * locale information.
   */
  pendingLocale?: LocaleCode | DeviceLocaleToken;

  /**
   * The locale that the user has "chosen" (or is implicitly selected)
   */
  selectedLocale: LocaleCode | DeviceLocaleToken;

  /**
   * Any error that occured in the most recent attempt to load a locale.
   */
  lastError?: {
    locale: LocaleCode | DeviceLocaleToken;
    error: SerializedError;
  };
}

export const i18nSlice = createSlice({
  name: "i18n",
  initialState: {
    isInitialized: false,
    activeLocale: DEFAULT_LOCALE,
    deviceLocale: getDevicePreferredLocale(),
    selectedLocale: getSelectedLocale(),
  } as I18nState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeLocalization.fulfilled, (state, action) => {
      state.isInitialized = true;
      state.activeLocale = action.payload;
    });
    builder.addCase(selectLocale.pending, (state, { meta }) => {
      state.pendingLocale = meta.arg;
      state.lastError = undefined;
    });
    builder.addCase(selectLocale.fulfilled, (state, { meta, payload }) => {
      if (meta.arg === state.pendingLocale) {
        state.selectedLocale = state.pendingLocale;
        state.activeLocale = payload;
        state.pendingLocale = undefined;
      }
    });
    builder.addCase(selectLocale.rejected, (state, { meta, error }) => {
      const locale = meta.arg;
      if (locale === state.pendingLocale) {
        state.lastError = {
          error,
          locale,
        };
        state.pendingLocale = undefined;
      }
    });
  },
});

export const { name, reducer } = i18nSlice;
