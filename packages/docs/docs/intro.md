---
sidebar_position: 1
slug: /
---

# Introduction

Macadam is an opinionated, production-ready, full-featured SaaS boilerplate.

It is built as a series of (micro)services that includes:

- Frontent Web Client (Koa application)
- Backend API Server (React application)
- Database (Postgres)
- Authentication (Ory Kratos)
- Error reporting (Sentry/Glitchtip)
- Analytics (Plausible)
- Metrics (Prometheus, Grafana)
- UI Component Explorer (Storybook)
- Gateway Web Server (Caddy)
- Deployments to Kubernetes

## Project goals

- Provide a complete, production-ready toolset to get a SaaS product started as quickly as possible, all parts included, using best practices.
- Fully self-hostable in a Kubernetes environment.

Many "starter projects" and "boilerplates" are incomplete or contrived examples that will still require a huge amount of effort to get a production-ready MVP shipped. But most SaaS projects have a common set of features that will be needed for a maintainable, production-ready deployment, i.e.: authentication, logging, tracing, error reporting, analytics, unit testing, database interactivity, user-facing client(s), an API server, infrastructure, etc. Providing this base is the primary goal of the project.

This is _not_ meant to be highly configurable with a many options available to the developer from the outset. Some tooling can be easily swapped out, while other pieces may require significant work. But ultimately it is, by design, very opiniated.
