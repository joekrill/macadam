import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadLocale, Locale } from "../locales";

/**
 * Updates the currently selected locale and loads it's messages if needed.
 */
export const setLocale = createAsyncThunk(
  "i18n/setLocale",
  async (locale: Locale, thunkAPI) => await loadLocale(locale)
);
