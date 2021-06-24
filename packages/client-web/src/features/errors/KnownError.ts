/**
 * Rerpresents a well-known error type identified by a code.
 */
export class KnownError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KnownError);
    }

    this.name = "KnownError";
  }
}
