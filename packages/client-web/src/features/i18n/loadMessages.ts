import { match } from "@formatjs/intl-localematcher";
import {
  DEFAULT_LOCALE,
  LocaleCode,
  TRANSLATED_LOCALES,
  TranslatedLocaleCode,
} from "./constants";
import en from "./messages/en.json";

export type LocaleMessages = typeof en;

const MESSAGES: Partial<Record<TranslatedLocaleCode, LocaleMessages>> = { en };

const getTranslatedLocale = (locale: string) =>
  match([locale], TRANSLATED_LOCALES, DEFAULT_LOCALE, {
    // "best fit" (the default) causes some odd behavior here. When test
    // locales are included, "en-CA" matches "en-XA" instead of "en".
    algorithm: "lookup",
  }) as TranslatedLocaleCode;

/**
 * Gets the messages for a given locale if loaded, otherwise returns undefined.
 */
export const getMessages = (locale: LocaleCode) =>
  MESSAGES[getTranslatedLocale(locale)];

/**
 * Attempts to asynchronously load messages and polyfills for a specific locale.
 */
export const loadMessages = async (locale: LocaleCode) => {
  const messagesLocale = getTranslatedLocale(locale);
  if (MESSAGES[messagesLocale]) {
    return;
  }

  const { default: messages } = await import(
    `./messages/${messagesLocale}.json`
  );
  if (messagesLocale !== "en") {
    MESSAGES[messagesLocale] = { ...en, ...messages };
  } else {
    MESSAGES[messagesLocale] = messages;
  }
};
