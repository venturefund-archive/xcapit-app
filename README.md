# Xcapit Smart Wallet

Xcapit Smart Wallet is an Ethereum, RSK and Polygon wallet app that offers an easy way to enter the blockchain world, learn about finance, define and track savings goals and invest to achieve them.

## Getting Started

### Installation

Clone the repo and open the directory:

```sh
git clone https://gitlab.com/xcapit-foss/app xcapit-smart-wallet
cd xcapit-smart-wallet
```

Ensure you have [Node](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed, then install and start Smart Wallet:

```sh
yarn install
npm start
```

Visit [`localhost:8100`](http://localhost:8100/) to view the app.

## Unit & E2E Tests (Karma & Protractor)

To run the tests, run:

```
 npm run test
```

## Testing on Real Devices

It's recommended that all final testing be done on a real device – both to assess performance and to enable features that are unavailable to the emulator (e.g. a device camera).

### Android

Follow the [Capacitor Android Environment Setup Guide](https://capacitorjs.com/docs/getting-started/environment-setup#android-development) to set up your development environment.

When your development environment is ready, run the `build:prod:xcapit:android` package script.

```sh
npm run build:prod:xcapit:android
```

### iOS

Follow the [Capacitor iOS Environment Setup Guide](https://capacitorjs.com/docs/getting-started/environment-setup#ios-development) to set up your development environment.

When your development environment is ready, run the `build:prod:xcapit:ios` package script.

```sh
npm run build:prod:xcapit:ios
```

## Configuration

For configuration settings you could see and change the next files.

```sh
./variables.env.ts
./src/environments/environment.ts
./src/environments/environment.prod.ts
```

## Docker

You can run Xcapit Smart Wallet with [Docker](https://www.docker.com/) by running the following commands.

```sh
cp docker-compose.yml.example docker-compose.yml
docker-compose up -d
```

## Related Services

Xcapit Smart Wallet depends on backend services for authentication, notifications, blockchain information and others features.
Related to blockchain information, you can configure yours RPCs urls and the [Covalent](https://www.covalenthq.com/) credentials in the [configuration files](#configuration).

The Xcapit backend services for authentication and notifications will be available in [gitlab.com/xcapit-foss](https://gitlab.com/xcapit-foss) soon.

### Schema

The next schema represent Xcapit Smart Wallet interacion with backend services.

![smart wallet services relation](https://gitlab.com/xcapit-foss/documentation/-/raw/main/static/img/smart_wallet/XcapitSmartWallet_services_interaction.jpeg)
