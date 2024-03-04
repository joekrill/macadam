## This is expected to be built in the context of the repo root directory

FROM node:20.11-alpine as builder

WORKDIR /var/macadam
ENV NODE_ENV production

COPY .pnp.cjs .pnp.loader.mjs .yarnrc.yml package.json yarn.lock .eslintrc.js .eslintignore ./
COPY .yarn .yarn
COPY packages/api-client ./packages/api-client
COPY packages/client-web ./packages/client-web

RUN \
  yarn install && \
  yarn workspace @macadam/api-client build && \
  yarn workspace @macadam/client-web build 

FROM nginx:1-alpine-slim

COPY --from=builder /var/macadam/packages/client-web/build /usr/share/nginx/html
COPY packages/client-web/nginx.conf /etc/nginx/conf.d/default.conf
