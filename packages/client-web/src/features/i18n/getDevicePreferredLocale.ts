import { match } from "@formatjs/intl-localematcher";
import { DEFAULT_LOCALE, LOCALES, LocaleCode } from "./constants";

export const getDevicePreferredLocale = () => {
  const preferred = navigator.languages
    ? [...navigator.languages]
    : [navigator.language];
  return match(preferred, LOCALES, DEFAULT_LOCALE) as LocaleCode;
};
