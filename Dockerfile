FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY . .
## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache python make g++
RUN npm install
RUN npm run build:prod:pwa:xcapit

FROM node:14-alpine as app

## Copy built node modules and binaries without including the toolchain
COPY --from=builder /usr/src/app/www /www
RUN npm install -g http-server
EXPOSE 4200
CMD http-server /www -p 4200
