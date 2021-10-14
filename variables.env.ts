export const environment = {
  apiUrl: '${process.env.API_URL}',
  production: true,
  environment: '${process.env.ENVIRONMENT}',
  whitelistedDomains: [
    'dummy.xcapit.com',
    'xcapit.com',
    'app.xcapit.com',
    'app.xcapit.com:443',
    'xcapit.com:443',
    'dummy.xcapit.com:443',
  ],
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    vapidKey: '${process.env.FIREBASE_VAPI_KEY}',
  },
  appUrl: '${process.env.APP_URL}',
  walletNetwork: '${process.env.WALLET_NETWORK}',
  ethAlchemyApiUrl: '${process.env.ETH_ALCHEMY_API_URL}',
  rskApiUrl: '${process.env.RSK_API_URL}',
  maticApiUrl: '${process.env.MATIC_API_URL}',
  derivedPaths: {
    ERC20: "m/44'/60'/0'/0/0",
    RSK: "m/44'/37310'/0'/0/0",
    MATIC: "m/44'/80001'/0'/0/0",
  },
};
