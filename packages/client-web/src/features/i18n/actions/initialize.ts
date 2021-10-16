import { createAsyncThunk } from "@reduxjs/toolkit";
import { DEFAULT_LOCALE, loadLocale, loadPolyfills } from "../locales";

/**
 * Loads any necessary polyfills needed for i18n.
 */
export const initialize = createAsyncThunk("i18n/initialize", async () => {
  await loadPolyfills();
  await loadLocale(DEFAULT_LOCALE);
});
