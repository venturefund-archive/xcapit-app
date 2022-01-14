export const environment = {
  apiUrl: 'https://nonprod.xcapit.com/v1/api',
  production: true,
  environment: 'PREPROD',
  whitelistedDomains: [
    'nonprod.xcapit.com',
    'xcapit.com',
    'app.xcapit.com',
    'app.xcapit.com:443',
    'xcapit.com:443',
    'nonprod.xcapit.com:443',
  ],
  firebase: {
    apiKey: 'AIzaSyCGRrSS33BDKXLros4K_EwVlcIUxUvqFks',
    authDomain: 'nonprod-xcapit-app.firebaseapp.com',
    projectId: 'nonprod-xcapit-app',
    storageBucket: 'nonprod-xcapit-app.appspot.com',
    messagingSenderId: '247745125245',
    appId: '1:247745125245:web:aca76674b4bc3bbb044a14',
    measurementId: 'G-T7385F8FS5',
    vapidKey: 'BB3M2sdkTsJCuJVcyBbTDHVg02mVgRYZVlkb6xnip-YgrZHedWi75rK0DJUwagIPeDC29T74pb5Px-GngAw0UGc',
  },
  appUrl: 'https://nonprod.xcapit.com/',
  covalentApiUrl: 'https://api.covalenthq.com/v1/',
  covalentApiKey: 'ckey_124a59c33c49457082d54ccaa30',
  moonpayPK: 'pk_test_D6oAj7Lj4vAZV7QhVIi5XpIO0sfJHa3a',
  walletNetwork: 'testnet',
  ethAlchemyApiUrl: 'alchemy.url',
  covalentApiKey: 'test.key',
  rskApiUrl: 'https://rsk.node',
  maticApiUrl: 'https://matic.url',
  bscApiUrl: 'https://bsc.url',
  binanceApiUrl: 'https://binance.url',
  chainId:{
    POLYGON: 80001
  },
  derivedPaths: {
    ERC20: "m/44'/60'/0'/0/0",
    RSK: "m/44'/37310'/0'/0/0",
    MATIC: "m/44'/80001'/0'/0/0",
    BSC_BEP20: "m/44'/60'/0'/0/0",
  }
};
