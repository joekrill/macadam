# Macadam

- [About](#about)
  - [Project goals](#project-goals)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Starting a development environment](#prerequisites)
  - [TLS](#tls)
  - [Running additional services](#running-additional-services)
- [Project Structure](#project-structure)
- [Core Services](#core-services)
  - [Web Client](#web-client)
  - [API Server](#api-server)
  - [Database](#Database)
  - [Authentication](#authentication)
  - [Error Reporting](#error-reporting)
  - [Analytics](#analytics)
  - [Metrics](#metrics)
  - [UI Component Explorer](#ui-component-explorer)
  - [Gateway Web Server](#gateway-web-server)
- [Development Services](#development-services)
  - [Mail Interceptor](#mail-interceptor)
  - [pgweb](#pgweb)

## About

Macadam is a full-stack, software-as-a-service (SaaS) "boilerplate" application. It is meant to serve as a complete, exemplary, starting point for building new SaaS-type projects.

### Project goals

- Provide a complete, production-ready toolset to get a SaaS product started as quickly as possible, all parts included, using best practices.
- Fully self-hostable in a Kubernetes environment.

Many "starter projects" and "boilerplates" are incomplete or contrived examples that will still require a huge amount of effort to get a production-ready MVP shipped. But most SaaS projects have a common set of features that will be needed for a maintainable, production-ready deployment, i.e.: authentication, logging, tracing, error reporting, analytics, unit testing, database interactivity, user-facing client(s), an API server, infrastructure, etc. Providing this base is the primary goal of the project.

This is _not_ meant to be highly configurable with a many options available to the developer from the outset. Some tooling can be easily swapped out, while other pieces may require significant work. But ultimately it is, by design, very opiniated.

## Getting started

### Prerequisites

The only prerequisite to getting a fully-usable environment up and running is a [Docker](https://www.docker.com/) environment with Docker Compose capabilities.

### Starting a development environment

1. Clone the repo (i.e. `git clone https://github.com/joekrill/macadam.git`)
2. `docker compose up`

The resulting web application will be accessible by visiting <https://localtest.me> in your browser.

Any mail sent during development will ba accessible using a local maildev instance by visiting <https://mail.localtest.me>.

### TLS

The auto-generated certificates will not be trusted by default and you will need to manually trust them. Alternatively, you can add the underlying Caddy certificate authority as a trusted root on your local machine.

```sh

# On MacOS
docker cp $(docker-compose ps -q caddy):/data/caddy/pki/authorities/local/root.crt /tmp/macadam_caddy.crt && sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /tmp/macadam_caddy.crt

# On Linux
docker cp $(docker-compose ps -q caddy):/data/caddy/pki/authorities/local/root.crt /usr/local/share/ca-certificates/macadam_caddy.crt && sudo update-ca-certificates

# Firefox on MacOS - `security.enterprise_roots.enabled` must be `true` in `about:config` (see https://support.mozilla.org/en-US/kb/setting-certificate-authorities-firefox for other OSes)
docker cp $(docker compose ps -q caddy):/data/caddy/pki/authorities/local/root.crt ~/Library/Application\ Support/Mozilla/Certificates/macadam_caddy.crt
```

### Running additional services

Some services are not run by default in the development environment. These can be include by using the appropriate compose configurations alongside the default `docker-compose.yml`. For example, to run a Storybook instance:

```sh
docker compose -f docker-compose.yml docker-compose.storybook.yml up
```

Available additional services:

- `docker-compose.analytics.yml` runs a Plausible Analytics instance and it's depdenencies.
- `docker-compose.error-tracking.yml` runs a GlitchTip instance for collecting crash and error reports.
- `docker-compose.metrics.yml` runs Prometheus and Grafana instances.
- `docker-compose.storybook.yml` runs a Storybook instance for explorting the web application UI components.

## Project Structure

Macadam is a monorepo that uses [Yarn Package Manager](https://yarnpkg.com/) and [it's workspaces feature](https://yarnpkg.com/features/workspaces) to organize code and provide tooling and scripts.

The basic folder structure highlighting the most important paths:

```
├── docs
├── packages
│   ├── api-server
│   ├── client-web
├── services
│   ├── caddy
│   ├── clickhouse
│   ├── glitchtip
│   ├── ...
├── package.json
├── docker-compose.yml
```

- `docs/` - project-level documentation
- `packages/` - the root folder that contains individual yarn workspaces
- `packages/api-server/` - source code for the API server
- `packages/client-web/` - source code for the frontend web client
- `services/` - configuration, scripts, and other files needed for running external services.
- `package.json` - root-level package.json
- `docker-compose.yml` - docker compose definition for the default development environment.

## Core Services

Macadam is built as a series of (micro)services that can roughly be broken down into:

- Web Client
- API Server
- Database
- Authentication
- Error Reporting
- Analytics
- Metrics
- UI Component Explorer
- Gateway Web Server
- Mail Interceptor (development)

### Web Client

The frontend web application (found at `packages/client-web`) is a Typescript application bootstrapped with [Create React App](https://create-react-app.dev).

- Written in [Typescript](https://www.typescriptlang.org).
- [Chakra UI](https://chakra-ui.com) for a consistent UI and component library - a simple, modular and accessible component library with theming support.
- [Storybook](https://storybook.js.org) for streamlining UI development, testing, and documentation.
- Declarative routing with [React Router](https://reactrouter.com)
- Local state management with [Redux Toolkit](https://redux-toolkit.js.org)
- Data fetching and caching with [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- Crash reporting using [Sentry.io's React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- Document head management with [React Helmet Async](https://github.com/staylor/react-helmet-async)
- Unit testing with [Testing Library](https://testing-library.com) and [Jest](https://jestjs.io)
- Icons included using [react-icons](https://react-icons.github.io/react-icons/)
- [Internationalization] with [Format.JS](https://formatjs.io/) (with [React-Intl](https://formatjs.io/docs/react-intl/))
- Unit testing with [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/)
- Validation using [zod](https://github.com/colinhacks/zod)

### API Server

The backend API servier (found at `packages/api-server`) is NodeJS application built using the [Koa framework](https://koajs.com).

- Written in [Typescript](https://www.typescriptlang.org).
- Database integration with [MikroORM](https://mikro-orm.io).
- Low-overhead logging with [pino](https://getpino.io)
- Crash reporting using [Sentry.io's Node SDK](https://docs.sentry.io/platforms/node/).
- [Prometheus](https://prometheus.io) Metrics reporting.
- Health reporting endpoints
- Unit testing with [Jest](https://jestjs.io/) and [SuperTest]](https://github.com/visionmedia/supertest)

### Database

[PostgreSQL](https://www.postgresql.org) is used by the API server, Kratos, Plausible Analytics, and GlitchTip. Each application is it's own database

### Authentication

Identity & User Management is implemented using [Ory Kratos](https://www.ory.sh/kratos/) - a cloud native user management system.

### Error Reporting

[GlitchTip](https://glitchtip.com) is used for error reporting collection and analysis. GlitchTip is a branch of, and (currently) compatible with, [Sentry.io](https://sentry.io) - and the reporting clients use the Sentry.io SDKS. Switching to Sentry would simply require changing the DSNs used.

### Analytics

TODO: Plausible Analytics

### Metrics

TODO: Prometheus/Grafana

### UI Component Explorer

### Gateway Web Server

In development, [Caddy](https://caddyserver.com/) acts as the gateway web server and routes all incoming requests. `services/caddy/Caddyfile` tells Caddy how to do this.

## Development Services

### Mail Interceptor

In development, all mail is routed through Maildev, which allows viewing emails in the browser by visiting <https://mail.localtest.me>.

[Maildev](https://github.com/maildev/maildev)

### pgweb

[pgweb](https://sosedoff.github.io/pgweb/) is a web-based client for PostgreSQL. This allows browsing and querying the database directly to aid in debugging and development. Visit <https://pgweb.localtest.me> to access the running pgweb instance.
