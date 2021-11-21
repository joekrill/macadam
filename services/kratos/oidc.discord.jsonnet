local claims = {
  email_verified: true
} + std.extVar('claims');

{
  identity: {
    traits: {
      // Allowing unverified email addresses enables account
      // enumeration attacks, especially if the value is used for
      // e.g. verification or as a password login identifier.
      //
      // It is assumed that Slack requires an email to be verified before accessible via OAuth (because they don't provide a email_verified field).
      email: claims.email
    },
  },
}
