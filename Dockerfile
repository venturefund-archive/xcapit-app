FROM node:16.14.2-alpine3.15 as builder

WORKDIR /usr/src/app
COPY . .
RUN yarn install && \
    npm run build:prod:pwa:xcapit

FROM nginxinc/nginx-unprivileged as app

COPY --from=builder /usr/src/app/www /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /usr/src/app/.nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 4200 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
