import { shouldPolyfill as shouldPolyfillDateTimeFormat } from "@formatjs/intl-datetimeformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillDisplayNames } from "@formatjs/intl-displaynames/should-polyfill";
import { shouldPolyfill as shouldPolyfillListFormat } from "@formatjs/intl-listformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillNumberFormat } from "@formatjs/intl-numberformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillPluralRules } from "@formatjs/intl-pluralrules/should-polyfill";
import { shouldPolyfill as shouldPolyfillRelativetimeformat } from "@formatjs/intl-relativetimeformat/should-polyfill";
import { LocaleCode } from "../constants";

/**
 * Asynchronously loads the polyfills needed for a specific locale.
 * (`loadBasePolyfills()` should be called first)
 *
 * @privateRemarks
 *
 * Vite/esbuild does not support dynamically loading imports unless they start
 * with "/" or "./", which means anything in node_modules can't be loaded
 * dynamically (or at least not easily with Yarn PnP), so currently have to
 * have individual calls for each supported language. (there is no equivalent
 * `webpackInclude` directive currently). At some point they may
 * support this and we can de-dupe the code here.
 */
export const loadLocalePolyfills = async (locale: LocaleCode) => {
  switch (locale) {
    case "en":
    case "en-US": {
      await loadLocalePolyfillsEn();
      return;
    }
    case "en-GB": {
      await loadLocalePolyfillsEnGb();
      return;
    }
    case "en-CA": {
      await loadLocalePolyfillsEnCa();
      return;
    }
    case "es": {
      await loadLocalePolyfillsEs();
      return;
    }
  }
};

const loadLocalePolyfillsEn = () => {
  return Promise.allSettled([
    shouldPolyfillDisplayNames("en")
      ? import("@formatjs/intl-displaynames/locale-data/en")
      : Promise.resolve(),
    shouldPolyfillListFormat("en")
      ? import("@formatjs/intl-listformat/locale-data/en")
      : Promise.resolve(),
    shouldPolyfillPluralRules("en")
      ? import("@formatjs/intl-pluralrules/locale-data/en")
      : Promise.resolve(),
    shouldPolyfillNumberFormat("en")
      ? import("@formatjs/intl-numberformat/locale-data/en")
      : Promise.resolve(),
    shouldPolyfillDateTimeFormat("en")
      ? import("@formatjs/intl-datetimeformat/locale-data/en")
      : Promise.resolve(),
    shouldPolyfillRelativetimeformat("en")
      ? import("@formatjs/intl-relativetimeformat/locale-data/en")
      : Promise.resolve(),
  ]);
};

const loadLocalePolyfillsEnGb = () => {
  return Promise.allSettled([
    shouldPolyfillDisplayNames("en-GB")
      ? import("@formatjs/intl-displaynames/locale-data/en-GB")
      : Promise.resolve(),
    shouldPolyfillListFormat("en-GB")
      ? import("@formatjs/intl-listformat/locale-data/en-GB")
      : Promise.resolve(),
    shouldPolyfillPluralRules("en")
      ? import("@formatjs/intl-pluralrules/locale-data/en")
      : Promise.resolve(),
    shouldPolyfillNumberFormat("en-GB")
      ? import("@formatjs/intl-numberformat/locale-data/en-GB")
      : Promise.resolve(),
    shouldPolyfillDateTimeFormat("en-GB")
      ? import("@formatjs/intl-datetimeformat/locale-data/en-GB")
      : Promise.resolve(),
    shouldPolyfillRelativetimeformat("en-GB")
      ? import("@formatjs/intl-relativetimeformat/locale-data/en-GB")
      : Promise.resolve(),
  ]);
};

const loadLocalePolyfillsEnCa = () => {
  return Promise.allSettled([
    shouldPolyfillDisplayNames("en-CA")
      ? import("@formatjs/intl-displaynames/locale-data/en-CA")
      : Promise.resolve(),
    shouldPolyfillListFormat("en-CA")
      ? import("@formatjs/intl-listformat/locale-data/en-CA")
      : Promise.resolve(),
    shouldPolyfillPluralRules("en")
      ? import("@formatjs/intl-pluralrules/locale-data/en")
      : Promise.resolve(),
    shouldPolyfillNumberFormat("en-CA")
      ? import("@formatjs/intl-numberformat/locale-data/en-CA")
      : Promise.resolve(),
    shouldPolyfillDateTimeFormat("en-CA")
      ? import("@formatjs/intl-datetimeformat/locale-data/en-CA")
      : Promise.resolve(),
    shouldPolyfillRelativetimeformat("en-CA")
      ? import("@formatjs/intl-relativetimeformat/locale-data/en-CA")
      : Promise.resolve(),
  ]);
};

const loadLocalePolyfillsEs = () => {
  return Promise.allSettled([
    shouldPolyfillDisplayNames("es")
      ? import("@formatjs/intl-displaynames/locale-data/es")
      : Promise.resolve(),
    shouldPolyfillListFormat("es")
      ? import("@formatjs/intl-listformat/locale-data/es")
      : Promise.resolve(),
    shouldPolyfillPluralRules("es")
      ? import("@formatjs/intl-pluralrules/locale-data/es")
      : Promise.resolve(),
    shouldPolyfillNumberFormat("es")
      ? import("@formatjs/intl-numberformat/locale-data/es")
      : Promise.resolve(),
    shouldPolyfillDateTimeFormat("es")
      ? import("@formatjs/intl-datetimeformat/locale-data/es")
      : Promise.resolve(),
    shouldPolyfillRelativetimeformat("es")
      ? import("@formatjs/intl-relativetimeformat/locale-data/es")
      : Promise.resolve(),
  ]);
};
