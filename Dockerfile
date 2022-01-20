FROM node:14.18-alpine

RUN mkdir -p /usr/src/app 

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN yarn
RUN yarn build

EXPOSE 3050

ENV NODE_ENV=production

CMD node dist/index.js
