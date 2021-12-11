## "v1" Milestone

- Figure out how to share logic between front-end/back-end while still having hot-reloading work and without ejecting
- setup lint-staged
  - apply this to other things as well? i18n updates?
- (api-server) consider namespacing all contexts?
- (client-web) Invalidate data on logout/login (https://redux-toolkit.js.org/rtk-query/api/created-api/cache-management-utils#resetapistate)
- Flatten traits?
- (client-web) User settings
- (client-web) How to deal with unverified email address
  - (client-web) Show notification component whne email address is not verififed
  - https://github.com/ory/kratos/issues/1328
- (client-web) Handle /sessions/whoami 401 response (vs request failure)
- Detect session expiration and handle it somehow (modal login form? a la Gmail?)
- (api-server) Uploads
- (api-server) Audit Logging
- Integration tests (i.e. using cypress)
- commitlint
- CI script
  - eslint+prettier?
- "Down for Maintenance" state
- (client-web) contact form
- Background tasks
- DB Seeding
- standards
  - https://docs.devland.is/technical-overview/api-design-guide/data-definitions

## Low priority

- github templates: https://github.com/cezaraugusto/github-template-guidelines
- Vulnerability Disclosure Policy (https://github.com/disclose/dioterms/blob/master/core-terms-vdp.md)
- Anonymizing data
- Data deletion (user account deletion)
- Data download (whole account)
- (client-web) Add OpenGraph attributes (http://ogp.me/)
- (client-web) Handle logins across tabs (use localStorage to signal session changes? BroadcastChannel?)
- (client-web) Auth forms: auto-focus first field when rendering forms.
- (client-web) Auth: if email was entered in the login form, autopopulate forgot password form
- (api-server) Reduce amount of logging output in development
- (api-server) better `ctx.state` serializer for pino (use zod?)

## Blocked

- (client-web) Auth: password requirements hint
  - Not currently possible with Kratos
  - https://github.com/ory/kratos/issues/1682
  - https://github.com/ory/kratos/issues/1535
- OpenTelemety
  - Versioning issues (https://github.com/open-telemetry/opentelemetry-js-contrib/issues/749)
- Kratos OIDC config via environment variables
  - https://github.com/ory/x/pull/420
- Some way to upload/change avatar (currently it is just a URL string)
- (api-server) switch to esmodules
  - https://github.com/node-fetch/node-fetch/issues/1279#issuecomment-915062146

## Major Features

- Admin panel (AdminJS? https://github.com/SoftwareBrothers/adminjs)
- (client-web) Offline support
- Upgrade Postgres to v14
- (client-web) PWA
- production/staging kubernetes deployments
- (client-mobile) Mobile app (react-native)
- (metrics) alert manager
- (docs) Better documentation (docusaurus?)
- (payments) implement (stripe?)
- (feature-toggles) implement
  - https://github.com/Unleash/unleash
  - https://github.com/Flagsmith/flagsmith
  - https://github.com/checkr/flagr
  - https://github.com/markphelps/flipt
  - https://github.com/featurehub-io/featurehub
- (client-admin) Admin interface/API (user management)
- i18n Tooling
  - https://github.com/mirego/accent
  - https://github.com/ever-co/ever-traduora
  - https://docs.weblate.org/en/latest/
- Notifications
  - https://notifire.co

## Ongoing

- (metrics) add additional dashboards
- (client-web) Storybook stories
- (api-server) Additional test coverage
- (client-web) Additional test coverage + enforce minimum
- https://cheatsheetseries.owasp.org/index.html
- https://jacobian.org/2021/jul/8/appsec-pagnis/

## Reference Projects:

- https://github.com/cedrickchee/saas-starter
- https://gitlab.com/gnaar
- https://github.com/NoQuarterTeam/boilerplate
- https://github.com/Saas-Starter-Kit/SAAS-Starter-Kit-Pro
