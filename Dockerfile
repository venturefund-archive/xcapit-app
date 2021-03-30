FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY . .
## Install build toolchain, install node deps and compile native add-ons
RUN npm install
RUN npm run build:prod:pwa:xcapit

FROM nginx as app

#COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/www /usr/share/nginx/html

EXPOSE 4200 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
