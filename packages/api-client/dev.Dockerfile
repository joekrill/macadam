# This is expected to be used in the context of the repo root directory

FROM node:20.11

WORKDIR /var/macadam
RUN yarn
CMD ["yarn", "workspace", "@macadam/api-client", "run", "start"]
