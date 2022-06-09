FROM node:18

WORKDIR /usr/worker

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start"]