## This is expected to be built in the context of the repo root directory

FROM node:20.10-alpine as builder

WORKDIR /var/macadam

ENV NODE_ENV production

COPY .pnp.cjs .pnp.loader.mjs .yarnrc.yml package.json yarn.lock ./
COPY .yarn .yarn
COPY packages/api-server ./packages/api-server

RUN \
  yarn workspaces focus @macadam/api-server && \
  yarn workspace @macadam/api-server run build 

FROM node:20.10-alpine as app

WORKDIR /var/macadam
COPY --from=builder /var/macadam /var/macadam
WORKDIR /var/macadam/packages/api-server

ENV NODE_ENV="production"
ENV PORT="4000"
EXPOSE 4000
EXPOSE 9464

WORKDIR /var/macadam/packages/api-server
CMD ["yarn", "run", "start"]
