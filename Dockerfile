FROM node:14-alpine3.12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copying packages first helps take advantage of docker layers
COPY package*.json .env ./

RUN npm install
RUN npm install -g ts-node-dev
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]


#FROM node:14
#
## sets the working directory for any RUN, CMD, COPY command
## all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
#WORKDIR /usr/src/app
#
#RUN npm install i ts-node-dev@latest -g
#
## Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR
#COPY ["package.json", "tsconfig.json", ".env", "./"]
#
## Copies everything in the src directory to WORKDIR/src
#COPY ./src ./src
#
## Installs all packages
#RUN npm install
#
## Runs the dev npm script to build & start the server
#CMD npm run dev
