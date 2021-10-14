FROM node:14-alpine as builder

ARG API_URL=test
ARG ARGIRONMENT=test
ARG FIREBASE_API_KEY=test
ARG FIREBASE_PROJECT_ID=test
ARG FIREBASE_STORAGE_BUCKET=test
ARG FIREBASE_MESSAGING_SENDER_ID=test
ARG FIREBASE_APP_ID=test
ARG FIREBASE_VAPI_KEY=test
ARG APP_URL=test
ARG WALLET_NETWORK=test
ARG ETH_ALCHEMY_API_URL=test
ARG RSK_API_URL=test
ARG MATIC_API_URL=test

WORKDIR /usr/src/app
COPY . .
## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache git
RUN npm install yarn
RUN yarn install
RUN npm run build:prod:pwa:xcapit

FROM nginx as app

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/www /usr/share/nginx/html

EXPOSE 4200 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
