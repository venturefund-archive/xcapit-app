var fs = require('fs');

var stores = {
  ios: {
    appId: 'com.xcapit.iosapp',
    appName: 'Xcapit',
  },
  android: {
    appId: 'com.xcapit.app',
    appName: 'xcapit',
  },
};

var argStore = process.argv.slice(2);

function setStoreConfig() {
  var newAppID = 'appId: ' + "'" + stores[argStore].appId + "'";
  var newAppName = 'appName: ' + "'" + stores[argStore].appName + "'";

  var config = fs.readFileSync('./capacitor.config.ts', 'utf-8').toString();
  config = config.replace(/appId:\s*'com.xcapit[^\,]*/, newAppID);
  config = config.replace(/appName:\s*'[^\,]*/, newAppName);
  fs.writeFileSync('./capacitor.config.ts', config);
}

function main() {
  if (!argStore || !stores[argStore]) {
    console.log('\x1b[1m\x1b[31m❌ Store is not set 😑\x1b[39m\x1b[22m');
    process.exit();
  }
  setStoreConfig();
  console.log('\x1b[1m\x1b[32m🔥 🦄 ✨' + argStore + ' store config✨ is set 🦄 🔥\x1b[39m\x1b[22m');
  process.exit();
}

main();
