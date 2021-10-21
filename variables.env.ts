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
  },
  appUrl: 'https://dummy.xcapit.com/',
  covalentApiUrl: 'https://api.covalenthq.com/v1/',
  walletNetwork: 'testnet',
  ethAlchemyApiUrl: 'https://eth-kovan.alchemyapi.io/v2/tfmomSigQreoKgOjz0W9W-j5SdtKkiZN',
  covalentApiKey: 'ckey_124a59c33c49457082d54ccaa30',
  rskApiUrl: 'https://public-node.testnet.rsk.co',
  maticApiUrl: 'https://rpc-mumbai.maticvigil.com/v1/5fc0291a70d1714b3595d5a2fb5ceacec81ab086',
  derivedPaths: {
    ERC20: "m/44'/60'/0'/0/0",
    RSK: "m/44'/37310'/0'/0/0",
    MATIC: "m/44'/80001'/0'/0/0",
  },
};
