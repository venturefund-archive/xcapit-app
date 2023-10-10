FROM node:16.14.2-alpine3.15 as builder

WORKDIR /usr/src/app
COPY . .
RUN yarn install && \
    npm run build:prod:pwa:xcapit

FROM nginx as app

COPY --from=builder /usr/src/app/www /usr/share/nginx/html

EXPOSE 4200 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
