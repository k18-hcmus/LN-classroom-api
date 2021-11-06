FROM node:14-alpine
WORKDIR /app

COPY ./ ./

RUN npm i yarn
RUN yarn install
RUN yarn build

CMD [ "yarn", "start" ]

EXPOSE 8081