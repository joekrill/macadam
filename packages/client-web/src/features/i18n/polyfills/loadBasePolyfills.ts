import { shouldPolyfill as shouldPolyfillDateTimeFormat } from "@formatjs/intl-datetimeformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillDisplayNames } from "@formatjs/intl-displaynames/should-polyfill";
import { shouldPolyfill as shouldPolyfillGetCanonicalLocales } from "@formatjs/intl-getcanonicallocales/should-polyfill";
import { shouldPolyfill as shouldPolyfillListFormat } from "@formatjs/intl-listformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillLocale } from "@formatjs/intl-locale/should-polyfill";
import { shouldPolyfill as shouldPolyfillNumberFormat } from "@formatjs/intl-numberformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillPluralRules } from "@formatjs/intl-pluralrules/should-polyfill";
import { shouldPolyfill as shouldPolyfillRelativetimeformat } from "@formatjs/intl-relativetimeformat/should-polyfill";

/**
 * Loads the polyfills that are needed regardless of the locale selected.
 */
export const loadBasePolyfills = async () => {
  // NOTE: the order of loading polyfills matters. See https://formatjs.io/docs/polyfills
  if (shouldPolyfillGetCanonicalLocales()) {
    await import("@formatjs/intl-getcanonicallocales/polyfill");
  }

  if (shouldPolyfillLocale()) {
    await import("@formatjs/intl-locale/polyfill");
  }

  if (shouldPolyfillDisplayNames()) {
    await import("@formatjs/intl-displaynames/polyfill");
  }

  if (shouldPolyfillListFormat()) {
    import("@formatjs/intl-listformat/polyfill");
  }

  if (shouldPolyfillPluralRules()) {
    import("@formatjs/intl-pluralrules/polyfill");
  }

  if (shouldPolyfillNumberFormat()) {
    import("@formatjs/intl-numberformat/polyfill");
  }

  if (shouldPolyfillDateTimeFormat()) {
    await import("@formatjs/intl-datetimeformat/polyfill");
    await import("@formatjs/intl-datetimeformat/add-all-tz");
  }

  if (shouldPolyfillRelativetimeformat()) {
    await import("@formatjs/intl-relativetimeformat/polyfill");
  }
};
