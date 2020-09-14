FROM node:14-alpine as builder
ARG ENVIRONMENT
ARG PRODUCTION
ARG API_URL
WORKDIR /usr/src/app
COPY . .
ENV ENVIRONMENT=$ENVIRONMENT
ENV PRODUCTION=$PRODUCTION
ENV API_URL=$API_URL
## Install build toolchain, install node deps and compile native add-ons
RUN npm install
RUN npm run build:prod:pwa:xcapit

FROM nginx as app

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/www /usr/share/nginx/html

EXPOSE 4200 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
