local claims = std.extVar('claims');
{
  identity: {
    traits: {
      // VK don't provide an email_verified field.
      //
      // The email might be empty if the user is not allowed to an email scope.
      [if "email" in claims then "email" else null]: claims.email,
    },
  },
}
