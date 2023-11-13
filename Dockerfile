FROM node:18

WORKDIR /vending-machine
COPY package.json .
RUN npm install
COPY . .
CMD npm start
