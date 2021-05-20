const fs = require('fs');

const capacitorConfigPath = './capacitor.config.json';
const stores = {
  ios: {
    appId: 'com.xcapit.iosapp',
    appName: 'Xcapit'
  },
  android: {
    appId: 'com.xcapit.app',
    appName: 'xcapit'
  }
};

const argStore = process.argv.slice(2);

const setCapacitorAppIdAndName = () => {
  const newContent = JSON.parse(fs.readFileSync(capacitorConfigPath, 'utf-8').toString());
  for (const [key, value] of Object.entries(stores[argStore])) {
    newContent[key] = value;
  }
  fs.writeFileSync(capacitorConfigPath, JSON.stringify(newContent));
};


const main = () => {
  if (!argStore || !stores[argStore]) {
    console.log('\x1b[1m\x1b[31m❌ Store is not set 😑\x1b[39m\x1b[22m');
    process.exit();
  }
  setCapacitorAppIdAndName();
  console.log(`\x1b[1m\x1b[32m🔥 ✨${argStore} store config✨ is set 🦄 🔥\x1b[39m\x1b[22m`);
  process.exit();
};

main();
