/*
Setup
-----
1. Create a Facebook developer account: https://developers.facebook.com/
2. Create an Oauth2 app: https://developers.facebook.com/apps/
  - Click "Set up" under "Facebook Login"
  - "Valid OAuth Redirect URIs" should include:
    - https://localtest.me/kratos/public/self-service/methods/oidc/callback/facebook

"App ID" and "App Secret" can be found in the "Settings" -> "Basic" section.

Reference
---------
https://www.ory.sh/kratos/docs/guides/sign-in-with-github-google-facebook-linkedin/#facebook
*/

local claims = std.extVar('claims');
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
