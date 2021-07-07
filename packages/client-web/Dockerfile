# This is expected to be used in the context of the repo root directory

FROM node:16.4 AS builder

WORKDIR /opt/saas-starter
COPY . .
RUN yarn && yarn workspace client-web run build
