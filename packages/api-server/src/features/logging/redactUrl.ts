/**
 * Masks a URL's password.
 */
export const redactUrl = (url: string | URL) => {
  try {
    const copy = new URL(url);
    if (copy.password) {
      copy.password = "*****";
    }
    return copy;
  } catch (err) {
    // invalid format? Just redact the whole thing.
    return "[url redacted]";
  }
};
