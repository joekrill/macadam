# Macadam

- About
- Getting started
- Core Services
  - Frontend Web Client
  - Backend API
  - Identity/Authentication
  - Database
  - Crash Reporting
  - Analytics
  - Metrics
- Development Services
  - Caddy
  - Maildev

## About

Macadam is a full stack software-as-a-service application meant to serve as a complete, exemplary starting point for new SaaS-type projects.

## Getting started

1. Clone the repo
2. `docker compose up`

- Web application: `https://localtest.me`
- Mail interceptor: `https://mail.localtest.me`
- Component Storybook: `https://storybook.localtest.me`
- Kratos private API: `https://kratos.localtest.me`

The auto-generated certificates will not be trusted by default and you will need to manually trust them. Alternatively, you can add the underlying Caddy certificate authority as a trusted root on your local machine.

```sh

# On MacOS
docker cp $(docker-compose ps -q caddy):/data/caddy/pki/authorities/local/root.crt /tmp/macadam_caddy.crt && sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /tmp/macadam_caddy.crt

# On Linux
docker cp $(docker-compose ps -q caddy):/data/caddy/pki/authorities/local/root.crt /usr/local/share/ca-certificates/macadam_caddy.crt && sudo update-ca-certificates

# Firefox on MacOS - `security.enterprise_roots.enabled` must be `true` in `about:config` (see https://support.mozilla.org/en-US/kb/setting-certificate-authorities-firefox for other OSes)
docker cp $(docker compose ps -q caddy):/data/caddy/pki/authorities/local/root.crt ~/Library/Application\ Support/Mozilla/Certificates/macadam_caddy.crt

```

## Components

Macadam is built as a series of (micro)services.

### Frontend Web Client

The frontend web application is bootstrapped with [Create React App](https://create-react-app.dev).

- Written in [Typescript](https://www.typescriptlang.org).
- Built with [Chakra UI](https://chakra-ui.com) - a simple, modular and accessible component library with theming support.
- [Storybook](https://storybook.js.org) for streamlining UI development, testing, and documentation.
- Declarative routing with [](https://reactrouter.com).
- Local state management with [Redux Toolkit](https://redux-toolkit.js.org).
- Data fetching and caching with [RTK Query](https://redux-toolkit.js.org/rtk-query/overview).
- Crash reporting using [Sentry.io's React SDK](https://docs.sentry.io/platforms/javascript/guides/react/).
- Document head management with [React Helmet Async](https://github.com/staylor/react-helmet-async).
- Unit testing with [Testing Library](https://testing-library.com) and [Jest](https://jestjs.io).

### Backend API

The backend API is NodeJS application built using the [Koa framework](https://koajs.com).

- Written in [Typescript](https://www.typescriptlang.org).
- Database integration via [MikroORM](https://mikro-orm.io).
- Low-overhead logging with [pino](https://getpino.io)
- Crash reporting using [Sentry.io's Node SDK](https://docs.sentry.io/platforms/node/).
- [Prometheus](https://prometheus.io) Metrics reporting.
- Health reporting endpoints

### Authentication

Identity & User Management is implemented using [Ory Kratos](https://www.ory.sh/kratos/) - a cloud native user management system.

### Database

[PostgreSQL](https://www.postgresql.org) is used by Kratos, GlitchTip and the `api-server` component.

### Crash Reporting

[GlitchTip](https://glitchtip.com) is used for crash reporting collection and analysis. GlitchTip is a branch of, and (currently) compatible with, [Sentry.io](https://sentry.io) - and the reporting clients use the Sentry.io SDKS. Switching to Sentry would simply require changing the DSNs used.

### Analytics

TODO: Plausible Analytics

### Metrics

TODO: Prometheus/Grafana

### Development Services

- Caddy
- Maildev
