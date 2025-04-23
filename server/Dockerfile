FROM node:22.14

WORKDIR /app

RUN mkdir server

COPY ./package*.json ./server

RUN cd server && yarn install

EXPOSE 3000

CMD [ "node", "server/app.js" ]
