## This is expected to be built in the context of the repo root directory!

FROM node:18.13-alpine

WORKDIR /var/macadam

ENV NODE_ENV production

COPY .pnp.cjs .pnp.loader.mjs .yarnrc.yml package.json yarn.lock ./
COPY .yarn .yarn
COPY packages/api-server ./packages/api-server

RUN \
  apk add --no-cache --virtual .gyp g++ make python3 && \
  ln -s /usr/bin/python3 /usr/bin/python && \
  yarn workspaces focus @macadam/api-server && \
  yarn workspace @macadam/api-server run build && \
  apk del .gyp

