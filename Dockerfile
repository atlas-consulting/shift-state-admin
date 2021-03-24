FROM node:12-alpine

COPY . .

RUN yarn

RUN yarn build

CMD NODE_ENV=production yarn start
