/**
 * Additional locales only used/available during development and for testing.
 */
const TEST_LOCALES = [
  // Psuedo-locales (auto-generated)
  "en-XA",
  "en-XB",
  "xx-AC",
  "xx-HA",
  "xx-LS",

  // Non-existant -- for testing failed `loadLocale`, for example
  "xx-NOPE",
] as const;

/**
 * The list of all available locales for the current environment. Order matters
 * here - it will be the order displayed in the locale select, as well as
 * provide weight when matching requested locales.
 *
 * IMPORTANT: Values here should be explicitly supported by `loadLocalePolyfills`!
 */
export const LOCALES = [
  "en-US",
  "en-GB",
  "en-CA",
  "en",
  "es",
  ...(import.meta.env.DEV ? [...TEST_LOCALES] : []),
] as const;

export type LocaleCode = (typeof LOCALES)[number];

/**
 * Locales that we have actual translations for. These should be a subset
 * of TRANSLATED_LOCALES!
 */
export const TRANSLATED_LOCALES = [
  "en",
  "es",
  ...(import.meta.env.DEV ? [...TEST_LOCALES] : []),
] as const;

export type TranslatedLocaleCode = (typeof TRANSLATED_LOCALES)[number];

// These ensures that TRANSLATED_LOCALES is a subset of LOCALES and will
// cause a type error if not.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AssertSubsetKeys = Satisfies<LocaleCode, TranslatedLocaleCode>;

/**
 * Used to indicate the device-preferred locale.
 */
export const deviceLocaleToken = "";

export type DeviceLocaleToken = typeof deviceLocaleToken;

/**
 * The default locale to use when no other is specified, and for fallbacks
 * situations.
 */
export const DEFAULT_LOCALE = "en" as const;
