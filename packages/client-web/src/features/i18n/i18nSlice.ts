import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { initialize } from "./actions/initialize";
import { setLocale } from "./actions/setLocale";
import { DEFAULT_LOCALE, Locale } from "./locales";

export interface I18nState {
  /**
   * Whether the i18n has been initialized (any necessary polyfills loaded for
   * the default locale)
   */
  initialized: boolean;

  /**
   * The locale currently being used/displayed in the application.
   */
  currentLocale: Locale;

  /**
   * When we are in the process of changing locales, the `pendingLocale` will be
   * set to the new locale while we are loading the necessary locale information.
   */
  pendingLocale?: Locale;

  /**
   * Any error that occured in the most recent attempt to load a locale.
   */
  lastError?: {
    locale: Locale;
    error: SerializedError;
  };
}

export const i18nSlice = createSlice({
  name: "i18n",
  initialState: {
    initialized: false,
    currentLocale: DEFAULT_LOCALE,
  } as I18nState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initialize.fulfilled, (state) => {
      state.initialized = true;
    });
    builder.addCase(setLocale.pending, (state, { meta }) => {
      state.pendingLocale = meta.arg;
      state.lastError = undefined;
    });
    builder.addCase(setLocale.fulfilled, (state, { meta }) => {
      if (meta.arg === state.pendingLocale) {
        state.currentLocale = state.pendingLocale;
        state.pendingLocale = undefined;
      }
    });
    builder.addCase(setLocale.rejected, (state, { meta, error }) => {
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
