import { shouldPolyfill as shouldPolyfillDateTimeFormat } from "@formatjs/intl-datetimeformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillDisplayNames } from "@formatjs/intl-displaynames/should-polyfill";
import { shouldPolyfill as shouldPolyfillListFormat } from "@formatjs/intl-listformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillNumberFormat } from "@formatjs/intl-numberformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillPluralRules } from "@formatjs/intl-pluralrules/should-polyfill";
import { shouldPolyfill as shouldPolyfillRelativetimeformat } from "@formatjs/intl-relativetimeformat/should-polyfill";
import { LocaleCode, REAL_LOCALES } from "../constants";

/**
 * Asynchronously loads the polyfills needed for a specific locale.
 * (`loadBasePolyfills()` should be called first)
 */
export const loadLocalePolyfills = async (locale: LocaleCode) => {
  // @ts-ignore
  if (!REAL_LOCALES.includes(locale)) {
    // Locale-specific polyfills don't exist for pseudo/non-existant locales,
    // so just bail.
    return;
  }

  const polyfills = [];

  if (shouldPolyfillDisplayNames(locale)) {
    polyfills.push(
      import(
        /* webpackInclude: /^(en|es)$/ */
        `@formatjs/intl-displaynames/locale-data/${locale}`
      )
    );
  }

  if (shouldPolyfillListFormat(locale)) {
    polyfills.push(
      import(
        /* webpackInclude: /^(en|es)$/ */
        `@formatjs/intl-listformat/locale-data/${locale}`
      )
    );
  }

  if (shouldPolyfillPluralRules(locale)) {
    polyfills.push(
      import(
        /* webpackInclude: /^(en|es)$/ */
        `@formatjs/intl-pluralrules/locale-data/${locale}`
      )
    );
  }

  if (shouldPolyfillNumberFormat(locale)) {
    polyfills.push(
      import(
        /* webpackInclude: /^(en|es)$/ */
        `@formatjs/intl-numberformat/locale-data/${locale}`
      )
    );
  }

  if (shouldPolyfillDateTimeFormat(locale)) {
    polyfills.push(
      import(
        /* webpackInclude: /^(en|es)$/ */
        `@formatjs/intl-datetimeformat/locale-data/${locale}`
      )
    );
  }

  if (shouldPolyfillRelativetimeformat(locale)) {
    polyfills.push(
      import(
        /* webpackInclude: /^(en|es)$/ */
        `@formatjs/intl-relativetimeformat/locale-data/${locale}`
      )
    );
  }

  await Promise.allSettled(polyfills);
};
