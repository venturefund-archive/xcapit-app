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
  directa24Url: 'https://directa.url',
  directa24ApiKey: 'directa.key',
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
  IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs',
  ONE_INCH_DEFAULTS: {
    slippage: 1,
    referralAddress: "0x0",
    fee: 0.5,
  },
  POLYGON_GAS_STATION: 'https://aGasStarionUrl',
  BLOCKCHAIN_DATA: [
    {
      name: "ERC20",
      derivedPath: "m/44'/60'/0'/0/0",
      id: "42",
      rpc: "https://ethereum.url",
      nativeToken: {
        value: "ETH",
        decimals: 18,
        chainId: 42,
        contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    },
    {
      name: "RSK",
      derivedPath: "m/44'/37310'/0'/0/0",
      id: "31",
      rpc: "https://rsk.url",
      nativeToken: {
        value: "RBTC",
        decimals: 18,
        chainId: 31,
        contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    },
    {
      name: "MATIC",
      derivedPath: "m/44'/80001'/0'/0/0",
      id: "80001",
      rpc: "https://matic.url",
      nativeToken: {
        value: "MATIC",
        decimals: 18,
        chainId: 80001,
        contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    },
    {
      name: "BSC_BEP20",
      derivedPath: "m/44'/60'/0'/0/0",
      id: "97",
      rpc: "https://bsc.url",
      nativeToken: {
        value: "BNB",
        decimals: 18,
        chainId: 97,
        contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    },
  ],
};