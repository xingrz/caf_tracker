# Builder

FROM node:12.16-alpine AS builder

RUN mkdir /opt/app
WORKDIR /opt/app

COPY package.json package-lock.json /opt/app/
RUN npm install

COPY . /opt/app/

RUN npm run build

# Runtime

FROM nginx:stable-alpine

ADD nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www
VOLUME /var/www/data

COPY --from=builder /opt/app/dist /var/www

EXPOSE 80
