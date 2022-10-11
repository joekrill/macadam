# This is expected to be used in the context of the repo root directory

FROM node:18.9

WORKDIR /var/macadam
RUN yarn
CMD ["yarn", "workspace", "@macadam/api-client", "run", "start"]
