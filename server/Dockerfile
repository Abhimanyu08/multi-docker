FROM node:18

WORKDIR /usr/server

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start"]