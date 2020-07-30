# Build
FROM node:14-alpine AS builder
WORKDIR /usr/src/app
ADD . .
RUN apk update && apk upgrade
RUN npm install

RUN npm run build:prod:pwa:xcapit
RUN yes | npm install -g @angular/cli

# Run
FROM node:14-alpine
RUN apk update && apk upgrade
RUN npm install -g http-server
COPY --from=builder /usr/src/app/www /www
CMD http-server /www -p 4200
