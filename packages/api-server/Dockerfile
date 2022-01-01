## This is expected to be built in the context of the repo root directory!

FROM node:16.10 AS builder

WORKDIR /var/macadam
ENV NODE_ENV production
COPY . .
RUN \
  yarn workspaces focus api-server && \
  yarn workspace api-server run build
