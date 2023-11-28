# This is expected to be used in the context of the repo root directory

FROM node:20.10

WORKDIR /var/macadam
RUN yarn
CMD ["yarn", "workspace", "@macadam/client-web", "run", "start"]
