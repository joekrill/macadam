## This is expected to be built in the context of the repo root directory!

FROM node:16.10 AS builder

WORKDIR /var/macadam
ENV NODE_ENV production
COPY .pnp.cjs .pnp.loader.mjs .yarnrc.yml package.json yarn.lock ./
COPY .yarn .yarn
COPY packages/api-server ./packages/api-server
RUN \
  yarn workspaces focus api-server && \
  yarn workspace api-server run build
