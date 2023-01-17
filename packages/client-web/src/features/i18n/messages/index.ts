import { LocaleCode } from "../constants";
import en from "./en.json";

export type LocaleMessages = typeof en;

const MESSAGES: Partial<Record<LocaleCode, LocaleMessages>> = { en };

/**
 * Gets the messages for a given locale if loaded, otherwise returns undefined.
 */
export const getMessages = (locale: LocaleCode) => MESSAGES[locale];

/**
 * Attempts to asynchronously load messages and polyfills for a specific locale.
 */
export const loadMessages = async (locale: LocaleCode) => {
  const { default: messages } = await import(`./${locale}.json`);
  MESSAGES[locale] = messages;
};
