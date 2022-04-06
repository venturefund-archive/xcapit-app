export const environment = {
  apiUrl: 'https://dummy.xcapit.com/v1/api',
  production: true,
  environment: 'PREPROD',
  whitelistedDomains: [
    'dummy.xcapit.com',
    'xcapit.com',
    'app.xcapit.com',
    'app.xcapit.com:443',
    'xcapit.com:443',
    'dummy.xcapit.com:443',
  ],
  firebase: {
    apiKey: 'AIzaSyCU-F8osRaeWGwTxdAJmDhWFfkjZqzUG7s',
    projectId: 'test-pwa-2019',
    storageBucket: 'test-pwa-2019.appspot.com',
    messagingSenderId: '1059796815977',
    appId: 'dummy',
    vapidKey: 'dummy',
    measurementId: 'dummy',
    authDomain: 'dummy',

  },
  appUrl: 'https://dummy.xcapit.com/',
  covalentApiUrl: 'https://covalent.url',
  moonpayPK: 'dummy_publishable_key',
  walletNetwork: 'testnet',
  ethAlchemyApiUrl: 'alchemy.url',
  covalentApiKey: 'test.key',
  rskApiUrl: 'https://rsk.node',
  maticApiUrl: 'https://matic.url',
  bscApiUrl: 'https://bsc.url',
  binanceApiUrl: 'https://binance.url',
  twoPiReferralAddress: '0x0001',
  derivedPaths: {
    ERC20: "m/44'/60'/0'/0/0",
    RSK: "m/44'/37310'/0'/0/0",
    MATIC: "m/44'/80001'/0'/0/0",
    BSC_BEP20: "m/44'/60'/0'/0/0",
  },
};


