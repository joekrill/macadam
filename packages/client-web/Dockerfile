# This is expected to be used in the context of the repo root directory

FROM node:16.10 AS builder

WORKDIR /opt/macadam
COPY . .
RUN yarn && yarn workspace client-web run build
