import { shouldPolyfill as shouldPolyfillDateTimeFormat } from "@formatjs/intl-datetimeformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillDisplayNames } from "@formatjs/intl-displaynames/should-polyfill";
import { shouldPolyfill as shouldPolyfillGetCanonicalLocales } from "@formatjs/intl-getcanonicallocales/should-polyfill";
import { shouldPolyfill as shouldPolyfillListFormat } from "@formatjs/intl-listformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillLocale } from "@formatjs/intl-locale/should-polyfill";
import { shouldPolyfill as shouldPolyfillNumberFormat } from "@formatjs/intl-numberformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillPluralRules } from "@formatjs/intl-pluralrules/should-polyfill";
import { shouldPolyfill as shouldPolyfillRelativetimeformat } from "@formatjs/intl-relativetimeformat/should-polyfill";
import en from "./messages/en.json";

export type LocaleMessages = typeof en;

/**
 * The locales that are supported.
 */
const SUPPORTED_LOCALES = ["en", "es"] as const;

/**
 * Additional locales only used/available during development.
 */
const DEV_LOCALES = [
  // Psuedo-locales
  "en-XA",
  "en-XB",
  "xx-AC",
  "xx-HA",
  "xx-LS",

  // Non-existant -- for testing failed `loadLocale`, for example
  "xx-NOPE",
] as const;

/**
 * The list of available locales.
 */
export const LOCALES =
  process.env.NODE_ENV === "development"
    ? [...SUPPORTED_LOCALES, ...DEV_LOCALES]
    : SUPPORTED_LOCALES;

export type Locale = typeof LOCALES[number];

/**
 * The default locale to use, also used for fallbacks
 */
export const DEFAULT_LOCALE = "en" as Locale;

const MESSAGES: Partial<Record<Locale, LocaleMessages>> = { en };

/**
 * Gets the messages for a given locale if loaded, otherwise returns undefined.
 */
export const getMessages = (locale: Locale) => MESSAGES[locale];

export const loadPolyfills = async () => {
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

/**
 * Attempts to asynchronously load messages and polyfills for a specific locale.
 */
export const loadLocale = async (locale: Locale) => {
  const { default: messages } = await import(
    /* webpackInclude: /(en|es|en-XA|en-XB|xx-AC|xx-HA|xx-LS).json/ */
    `./messages/${locale}.json`
  );
  MESSAGES[locale] = messages;

  // @ts-ignore
  if (!LOCALES.includes(locale)) {
    // Polyfills don't work for pseudo/non-existant locales
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
