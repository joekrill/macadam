# This is expected to be used in the context of the repo root directory

FROM node:18.13

WORKDIR /var/macadam
RUN yarn
CMD ["yarn", "workspace", "@macadam/client-web", "run", "start"]
