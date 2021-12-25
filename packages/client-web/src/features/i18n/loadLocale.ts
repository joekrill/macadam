import { LocaleCode } from "./constants";
import { loadMessages } from "./messages/index";
import { loadLocalePolyfills } from "./polyfills/loadLocalePolyfills";

/**
 * Load the message definitions and polyfills for a specific locale.
 */
export const loadLocale = async (locale: LocaleCode) =>
  Promise.all([loadMessages(locale), loadLocalePolyfills(locale)]);
