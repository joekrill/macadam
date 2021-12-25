/*
Setup
-----
1. Sign into the Azure portal: https://portal.azure.com/
2. Select/Find "Azure Active Directory"
3. Select "App Registrations"
4. Click "Register an application" button
5. Choose the "Web" platform and set the redirect URI: `https://localtest.me/kratos/public/self-service/methods/oidc/callback/microsoft`
6. Choose "Certificates & Secrets" from the sidebar
7. Add a new client secret. Be sure to use the value in the "Value" column, not the "Secret ID" column!  (set this as the `client_secret`)
8. The "Application (client) ID" can be found in the "Overview" tab (set this as the `client_id`)

Notes
-----
The profile photo does not appear to be accessible via openid connect

Reference
---------
https://www.ory.sh/kratos/docs/guides/sign-in-with-github-google-facebook-linkedin/#microsoft
https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app
https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
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
