import { match } from "@formatjs/intl-localematcher";
import { DEFAULT_LOCALE, LocaleCode, LOCALES } from "./constants";

/**
 * Returns the best match from the list of supported locales, given an list
 * of preferred locales.
 */
export const getBestMatchLocale = (locales: string[]) =>
  match(locales, LOCALES as string[], DEFAULT_LOCALE) as LocaleCode;
