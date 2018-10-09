FROM node:10-alpine

WORKDIR /srv/app

COPY . ./

RUN set -ex; \
		yarn install --frozen-lockfile; \
		yarn cache clean; \
  		yarn run build

EXPOSE 4000
CMD ["yarn", "start"]
