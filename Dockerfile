FROM node

COPY . .

RUN yarn

RUN yarn build

CMD NODE_ENV=prod yarn start