FROM node:alpine

WORKDIR /vending-machine
COPY package.json .
RUN npm install
COPY . .
CMD npm start
