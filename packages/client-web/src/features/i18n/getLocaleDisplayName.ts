/**
 * Returns the display for a locale using the locale's language itself
 * (as oppsed to the currently selected locale).
 */
export const getLocaleDisplayName = (locale: string) => {
  try {
    return new Intl.DisplayNames([locale], { type: "language" }).of(locale);
  } catch (error) {
    return undefined;
  }
};
