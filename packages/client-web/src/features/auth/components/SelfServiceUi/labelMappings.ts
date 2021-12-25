/**
 * A mapping of a field's `name` attribute to the desired label.
 * Kratos sents inconsistent labels (if any) for various forms. Until that's
 * fixed or improved, this give us more consistency.
 *
 * TODO: Localize these labels.
 */
export const LABEL_MAPPINGS: Record<string, string> = {
  password: "Password",

  /**
   * Kratos uses "ID" here (because it's possible to have multiple, so I guess
   * it doesn't distinguish). But we know we always want an email address.
   */
  password_identifier: "E-Mail",

  // The "recovery" flow doesn't provide a label, for some reason.
  email: "E-Mail",
};
