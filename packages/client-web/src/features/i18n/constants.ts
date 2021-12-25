/**
 * The "real" locales that are supported by the application.
 */
export const REAL_LOCALES = ["en", "es"] as const;

/**
 * Additional locales only used/available during development and for testing.
 */
const TEST_LOCALES = [
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
 * The list of all available locales for the current environment.
 */
export const LOCALES =
  process.env.NODE_ENV === "development"
    ? [...REAL_LOCALES, ...TEST_LOCALES]
    : [...REAL_LOCALES];

export type LocaleCode = typeof LOCALES[number];

/**
 * Used to indicate the device-preferred locale.
 */
export const deviceLocaleToken = Symbol.for("deviceLocaleToken");

export type DeviceLocaleToken = typeof deviceLocaleToken;

/**
 * The default locale to use when no other is specified, and for fallbacks
 * situations.
 */
export const DEFAULT_LOCALE = "en" as LocaleCode;
