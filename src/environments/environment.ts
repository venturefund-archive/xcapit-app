// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:9050/v1/api',
  // apiUrl: 'http://192.168.1.100:9050/v1/api', // para testear en app
  whitelistedDomains: ['localhost:9050', '192.168.1.100:9050'],
  firebase: {
    apiKey: 'AIzaSyDNz4_MQzlHuksxOYMgWLzDZbvo_gpRhFs',
    authDomain: 'prueba-aws-sns.firebaseapp.com',
    databaseURL: 'https://prueba-aws-sns.firebaseio.com',
    projectId: 'prueba-aws-sns',
    storageBucket: 'prueba-aws-sns.appspot.com',
    messagingSenderId: '753598433776',
    appId: '1:753598433776:web:476b346a93daba7b7a7535',
    measurementId: 'G-K4EFRL7ZJX',
    vapidKey:
      'BIt_nrgl0XMKQu9uny-1ScB01RfevXBLDQ6MR6KHhWhI4Td2W2cKRSbG31zKU37HONxdCDSdZodNvLZhb9BJ7WM'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
