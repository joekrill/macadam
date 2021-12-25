import {
  DeviceLocaleToken,
  deviceLocaleToken,
  LocaleCode,
  LOCALES,
} from "./constants";

const SELECTED_LOCALE_STORAGE_KEY = "locale";

export const getSelectedLocale = () => {
  try {
    const value = localStorage.getItem(SELECTED_LOCALE_STORAGE_KEY);
    if (value && LOCALES.includes(value as LocaleCode)) {
      return value as LocaleCode;
    }
  } catch {
    // TODO: report error
  }

  return deviceLocaleToken;
};

export const storeSelectedLocale = (locale: LocaleCode | DeviceLocaleToken) => {
  try {
    if (locale === deviceLocaleToken) {
      localStorage.removeItem(SELECTED_LOCALE_STORAGE_KEY);
    } else {
      localStorage.setItem(SELECTED_LOCALE_STORAGE_KEY, locale);
    }
  } catch {
    // TODO: report error
  }
};
