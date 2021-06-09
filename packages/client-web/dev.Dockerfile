# This is expected to be used in the context of the repo root directory

FROM node:16.3

WORKDIR /var/saas-starter
RUN yarn
CMD ["yarn", "workspace", "client-web", "run", "start"]
