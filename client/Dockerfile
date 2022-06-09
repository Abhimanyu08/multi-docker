FROM node:18 as builder 

WORKDIR /usr/client

COPY ./package.json .

RUN npm install

COPY . . 

RUN npm run build

FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/client/build /usr/share/nginx/html