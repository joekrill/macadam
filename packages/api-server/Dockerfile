## This is expected to be built in the context of the repo root directory

FROM node:20.10-alpine as builder

WORKDIR /var/dressmyrun

ENV NODE_ENV production

COPY .pnp.cjs .pnp.loader.mjs .yarnrc.yml package.json yarn.lock ./
COPY .yarn .yarn
COPY packages/api-server ./packages/api-server

RUN \
  yarn workspaces focus @dressmyrun/api-server && \
  yarn workspace @dressmyrun/api-server run build 

FROM node:20.10-alpine as app

WORKDIR /var/dressmyrun
COPY --from=builder /var/dressmyrun /var/dressmyrun
WORKDIR /var/dressmyrun/packages/api-server

ENV NODE_ENV="production"
ENV PORT="4000"
EXPOSE 4000
EXPOSE 9464

WORKDIR /var/dressmyrun/packages/api-server
CMD ["yarn", "run", "start"]
