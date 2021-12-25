/*
Setup
-----
1. Create a twitch account
2. Register an application: https://dev.twitch.tv/console
  - OAuth Redirect URLs: https://localtest.me/kratos/public/self-service/methods/oidc/callback/twitch
3. Click the "Manage" button next to the created app 
4. Update kratos.yml with the "Client ID" value
5. Click "New secret"
4. Update kratos.yml with the secret value

Reference
---------
https://www.ory.sh/kratos/docs/guides/sign-in-with-github-google-facebook-linkedin/#twitch
https://dev.twitch.tv/docs/authentication#registration
https://dev.twitch.tv/docs/authentication/getting-tokens-oidc
https://id.twitch.tv/oauth2/.well-known/openid-configuration
*/

local claims = {
  email_verified: false
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if "email" in claims then "email" else null]: claims.email,
      // [if "email_verified" in claims then "email_verified" else null]: claims.email_verified,
      [if "preferred_username" in claims then "name" else null]: claims.preferred_username, 
      [if "locale" in claims then "locale" else null]: claims.locale, 
      [if "picture" in claims then "picture" else null]: claims.picture,
      // [if "login" in claims then "username" else null]: claims.login,
    },
  },
}
