export const environment = {
  apiUrl: "https://nonprod.xcapit.com/v1/api",
  production: true,
  environment: "PRODUCCION",
  whitelistedDomains: [
    "nonprod.xcapit.com",
    "xcapit.com",
    "app.xcapit.com",
    "app.xcapit.com:443",
    "xcapit.com:443",
    "nonprod.xcapit.com:443",
  ],
  firebase: {
    apiKey: "AIzaSyCGRrSS33BDKXLros4K_EwVlcIUxUvqFks",
    authDomain: "nonprod-xcapit-app.firebaseapp.com",
    projectId: "nonprod-xcapit-app",
    storageBucket: "nonprod-xcapit-app.appspot.com",
    messagingSenderId: "247745125245",
    appId: "1:247745125245:web:aca76674b4bc3bbb044a14",
    measurementId: "G-T7385F8FS5",
    vapidKey:
    "BB3M2sdkTsJCuJVcyBbTDHVg02mVgRYZVlkb6xnip-YgrZHedWi75rK0DJUwagIPeDC29T74pb5Px-GngAw0UGc",
  },
  appUrl: "https://nonprod.xcapit.com/",
  covalentApiUrl: "https://api.covalenthq.com/v1/",
  covalentApiKey: "ckey_e3b0c3375c42497ca7f37bb7b59",
  moonpayPK: "pk_live_cDuMJUX7sqMvyiG6o9hr0eOlXguXJHQ7",
  walletNetwork: "mainnet",
  ethAlchemyApiUrl:
    "https://eth-mainnet.alchemyapi.io/v2/_tAb6nr3b1EEQqjG9fLAmuylZN4s0GhJ",
  rskApiUrl: "https://public-node.rsk.co/",
  maticApiUrl:
    "https://polygon-mainnet.g.alchemy.com/v2/bNwqiwxYin5HEWHGGvFZ7QBoDTzhel11",
  bscApiUrl: "https://bsc-dataseed.binance.org/",
  binanceApiUrl: "https://api1.binance.com",
  twoPiReferralAddress: "0x39D77e51c485F1ff65b1b3B42e9f67CdA221F597",
  derivedPaths: {
    ERC20: "m/44'/60'/0'/0/0",
    RSK: "m/44'/137'/0'/0/0",
    MATIC: "m/44'/966'/0'/0/0",
    BSC_BEP20: "m/44'/60'/0'/0/0",
  },
  IPFS_GATEWAY: "https://xcapit.mypinata.cloud/ipfs",
  ONE_INCH_DEFAULTS: {
    slippage: 1,
    referralAddress: "0x39D77e51c485F1ff65b1b3B42e9f67CdA221F597",
    fee: 0.5,
  },
  POLYGON_GAS_STATION: "https://gasstation-mainnet.matic.network/v2", // https://gasstation-mumbai.matic.today/v2
  BLOCKCHAIN_DATA: [
    {
      name: "ERC20",
      derivedPath: "m/44'/60'/0'/0/0",
      id: "1",
      rpc: "https://eth-mainnet.alchemyapi.io/v2/_tAb6nr3b1EEQqjG9fLAmuylZN4s0GhJ",
      nativeToken: {
        value: 'ETH',
        decimals: 18,
        chainId: 1,
        contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      }
    },
    {
      name: "RSK",
      derivedPath: "m/44'/137'/0'/0/0",
      id: "30",
      rpc: "https://public-node.rsk.co/",
      nativeToken: {
        value: 'RBTC',
        decimals: 18,
        chainId: 30,
        contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      },
    },
    {
      name: "MATIC",
      derivedPath: "m/44'/966'/0'/0/0",
      id: "137",
      rpc: "https://polygon-mainnet.g.alchemy.com/v2/bNwqiwxYin5HEWHGGvFZ7QBoDTzhel11",
      nativeToken: {
        value: 'MATIC',
        decimals: 18,
        chainId: 137,
        contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      },
    },
    {
      name: "BSC_BEP20",
      derivedPath: "m/44'/60'/0'/0/0",
      id: "56",
      rpc: "https://bsc-dataseed.binance.org/",
      nativeToken: {
        value: 'BNB',
        decimals: 18,
        chainId: 56,
        contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      }
    },
  ],
};