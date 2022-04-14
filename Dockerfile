FROM node:17.0.1-slim

RUN mkdir -p /usr/src/app 

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN yarn
RUN yarn build

EXPOSE 3050

ENV NODE_ENV=production
ENV PORT=3050
ENV API_MOVIEDB=3ffdab4505cd9c389472d2dc922563cf

CMD node dist/index.js
