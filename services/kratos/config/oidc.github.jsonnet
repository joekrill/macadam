/*
Setup
-----
Create one:
 - GitHub OAuth2 Client (https://github.com/settings/developers)
 - GitHub App Client (https://github.com/settings/apps)

Authorized redirect URIs should include (replace localtest.me with the appropriate domain):
 - https://localtest.me/kratos/public/self-service/methods/oidc/callback/github

* If this is just for authentication purposes, you likely want to use the "OAuth2 Client"

Reference
---------
https://www.ory.sh/kratos/docs/guides/sign-in-with-github-google-facebook-linkedin/#github
https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
https://docs.github.com/en/developers/apps/getting-started-with-apps/differences-between-github-apps-and-oauth-apps
https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app
https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app
*/

local claims = {
  email_verified: false
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if "email" in claims then "email" else null]: claims.email,
      [if "name" in claims then "name" else null]: claims.name, 
      [if "locale" in claims then "locale" else null]: claims.locale, 
      [if "picture" in claims then "picture" else null]: claims.picture,
    },
  },
}
