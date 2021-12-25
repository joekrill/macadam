/*
Setup
-----
1. Create an OAuth consent screen: https://console.cloud.google.com/apis/credentials/consent
2. Create OAuth 2.0 Client IDs: https://console.cloud.google.com/apis/credentials
  - Authorized redirect URIs should include (replace localtest.me with the appropriate domain):
    - https://localtest.me/kratos/public/self-service/methods/oidc/callback/google

Reference
---------
https://www.ory.sh/kratos/docs/guides/sign-in-with-github-google-facebook-linkedin/#google
https://developers.google.com/identity/protocols/oauth2/openid-connect
*/

local claims = {
  email_verified: true
} + std.extVar('claims');

{
  identity: {
    traits: {
      // [if "email" in claims && claims.email_verified then "email" else null]: claims.email,
      [if "email" in claims then "email" else null]: claims.email,
      [if "name" in claims then "name" else null]: claims.name, 
      [if "locale" in claims then "locale" else null]: claims.locale, 
      [if "picture" in claims then "picture" else null]: claims.picture,       
    },
  },
}
