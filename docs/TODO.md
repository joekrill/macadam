## "v1" Milestone

- (client-web) Detect session expiration and handle it somehow (modal login form? a la Gmail?)
- CI/CD pipeline
- production/staging kubernetes deployments
- OpenTelemety
  - Versioning issues (https://github.com/open-telemetry/opentelemetry-js-contrib/issues/749)
- Review Kratos configuration
  - https://www.ory.sh/kratos/docs/reference/configuration
- Some way to upload/change avatar (currently it is just a URL string)
- Agree to ToS on signup?
- Redirect back to original page after sign up/login using OIDC not working (always redirects to home)
- figure out versioning/bumping versions (automatically?)
  - https://semantic-release.gitbook.io/semantic-release/
  - https://dev.to/antongolub/the-chronicles-of-semantic-release-and-monorepos-5cfc
  - https://www.npmjs.com/package/auto

# "v1"+

- Integration tests (i.e. using cypress)
- (client-web) upgrade create-react-app
- Figure out how to share logic between front-end/back-end while still having hot-reloading work and without ejecting
- (api-server) Uploads
  - https://github.com/node-formidable/formidable
  - https://hub.docker.com/r/minio/minio/
- commitlint
- "Down for Maintenance" state
- Delete - remove confirmation and provide "undo" toast instead.
- Confirm email form - use dropdown with unverified email addresses when the user is logged in.
- Background tasks
  - https://github.com/OptimalBits/bull
  - https://github.com/Automattic/kue
  - https://devcenter.heroku.com/articles/node-redis-workers
- Docs/standards
  - https://docs.devland.is
- Move email/nodemailer functionality to a separate service/package
  - Use https://documentation.mjml.io/ ?
- Service accounts
  - https://www.ory.sh/kratos/docs/concepts/identity-schema/#json-schema-vocabulary-extensions

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
- (client-web) localize zod validation error/issue messages
  - https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md#customizing-errors-with-zoderrormap
- (client-web) localize kratos messages (is this possible currently?)
- Reduce number of requests made by sentry

## Blocked

- (client-web) Auth: password requirements hint
  - Not currently possible with Kratos
  - https://github.com/ory/kratos/issues/1682
  - https://github.com/ory/kratos/issues/1535
- Kratos OIDC config via environment variables
  - https://github.com/ory/x/pull/420
- (api-server) switch to esmodules
  - https://github.com/node-fetch/node-fetch/issues/1279#issuecomment-915062146
- Allow only logging in with verified email? https://github.com/ory/kratos/issues/1328

# Major features

- Admin panel (AdminJS? https://github.com/SoftwareBrothers/adminjs)
- (client-web) Offline support
- (client-web) PWA
  - https://developers.google.com/codelabs/project-fugu?hl=en#0
  - https://create-react-app.dev/docs/making-a-progressive-web-app/
  - https://github.com/GoogleChromeLabs/pwa-workshop-codelab
  - https://web.dev/install-criteria/
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
- Log aggregation
- Consider using Hydra? https://github.com/ory/kratos/discussions/937

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
