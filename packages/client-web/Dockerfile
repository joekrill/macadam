## This is expected to be built in the context of the repo root directory!

FROM node:20.10 AS builder

WORKDIR /var/macadam
ENV NODE_ENV production
COPY . .
RUN \
  yarn workspaces focus --production client-web && \
  yarn workspace client-web run build

FROM nginx:1.21.5-alpine
COPY --from=builder /var/macadam/packages/client-web/build /usr/share/nginx/html
