FROM node:14-alpine3.12

WORKDIR /usr/src/app

COPY package*.json .env ./

RUN npm install
RUN npm install -g ts-node-dev

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
