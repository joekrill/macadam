/*
Setup
-----
1. Create a discord account
2. Register an application: https://discord.com/developers/applications
3. Click the "OAuth2" item in the sidebar
3. Update kratos.yml with the "Client ID" and "Client Secret"
4. Add a redirect: https://localtest.me/kratos/public/self-service/methods/oidc/callback/discord

Reference
---------
https://www.ory.sh/kratos/docs/guides/sign-in-with-github-google-facebook-linkedin/#discord
https://discord.com/developers/docs/topics/oauth2
*/

local claims = {
  email_verified: false
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if "email" in claims then "email" else null]: claims.email,
      // [if "email_verified" in claims then "email_verified" else null]: claims.email_verified,
      [if "name" in claims then "name" else null]: claims.name, 
      [if "locale" in claims then "locale" else null]: claims.locale, 
      [if "picture" in claims then "picture" else null]: claims.picture,
    },
  },
}
