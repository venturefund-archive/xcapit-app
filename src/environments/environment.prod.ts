export const environment = {
  production: $ENV.PRODUCTION,
  environment: $ENV.ENVIRONMENT,
  apiUrl: $ENV.API_URL,
  whitelistedDomains: ['preprod.xcapit.com', 'xcapit.com', 'app.xcapit.com', 'app.xcapit.com:443', 'xcapit.com:443', 'preprod.xcapit.com:443'],
  firebase: {
    apiKey: 'AIzaSyCU-F8osRaeWGwTxdAJmDhWFfkjZqzUG7s',
    authDomain: 'test-pwa-2019.firebaseapp.com',
    databaseURL: 'https://test-pwa-2019.firebaseio.com',
    projectId: 'test-pwa-2019',
    storageBucket: 'test-pwa-2019.appspot.com',
    messagingSenderId: '1059796815977',
    appId: '1:1059796815977:web:00d4a1e1de77f5eb8592f8',
    vapidKey:
      'BBQTZJVBY9gH70xupGlC91sfxy-BvpKwlHkE0Gk-XN12NrPmirbm5Hf7FS-r65XnRRHNzQekOcLRfRlvMq9maEA'
  }
};
