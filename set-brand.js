const fs = require('fs');
const indexPath = './src/index.html';
const maninfestPath = './src/manifest.webmanifest';
const brands = {
  wcs: {
    id: 'wcs',
    assetsFolder: 'wcs',
    manifest: {
      name: 'WallCryptoStreet',
      shortName: 'WCS',
      themeColor: '#393a3e',
      backgroundColor: '#393a3e',
    },
    index: {
      title: 'WCS | WallCryptoStreet',
      themeColor: '#393a3e',
    },
    capacitorConfig: {
      appId: 'com.wallcryptostreet.app',
    },
  },
  xcapit: {
    id: 'xcapit',
    assetsFolder: 'xcapit',
    manifest: {
      name: 'xcapit',
      shortName: 'xcapit',
      themeColor: '#1c2d5e',
      backgroundColor: '#1c2d5e',
    },
    index: {
      title: 'xcapit',
      themeColor: '#1c2d5e',
    },
    capacitorConfig: {
      appId: 'com.xcapit.app',
    },
  },
};
const argBrand = process.argv.slice(2);

const replacePath = (data, assetsFolderToReplace) => {
  const newPath = `/${brands[argBrand].assetsFolder}/`;
  const pathToReplace = `/${assetsFolderToReplace}/`;
  return data.replace(new RegExp(pathToReplace, 'g'), newPath);
};

const getToReplace = (data) => {
  for (const key in brands) {
    const path = `/${brands[key].assetsFolder}/`;
    if (data.match(new RegExp(path, 'g'))) {
      return brands[key];
    }
  }
};

const replaceTitle = (data) => {
  const newTitle = `<title>${brands[argBrand].index.title}</title>`;
  return data.replace(new RegExp('<s*title[^>]*>(.*?)<s*/s*title>', 'g'), newTitle);
};

const replaceThemeColor = (data) => {
  const newThemeColor = `name="theme-color" content="${brands[argBrand].index.themeColor}"`;
  return data.replace(new RegExp('name="theme-color" content="(.*?)"', 'g'), newThemeColor);
};

const replaceOnIndex = () => {
  try {
    data = fs.readFileSync(indexPath, 'utf-8');
    const toReplace = getToReplace(data);
    let newContent = replacePath(data, toReplace.assetsFolder);
    newContent = replaceTitle(newContent);
    newContent = replaceThemeColor(newContent);
    fs.writeFileSync(indexPath, newContent);
  } catch (err) {
    console.log(err);
  }
};

const replaceOnManifest = () => {
  try {
    data = fs.readFileSync(maninfestPath, 'utf-8');
    const toReplace = getToReplace(data);
    const newContent = JSON.parse(replacePath(data, toReplace.assetsFolder));
    newContent.name = brands[argBrand].manifest.name;
    newContent.short_name = brands[argBrand].manifest.shortName;
    newContent.theme_color = brands[argBrand].manifest.themeColor;
    newContent.background_color = brands[argBrand].manifest.backgroundColor;
    fs.writeFileSync(maninfestPath, JSON.stringify(newContent));
  } catch (err) {
    console.log(err);
  }
};

const main = () => {
  if (!argBrand || !brands[argBrand]) {
    console.log('\x1b[1m\x1b[31m❌ Brand is not set 😑\x1b[39m\x1b[22m');
    process.exit();
  }
  replaceOnIndex();
  replaceOnManifest();
  console.log(`\x1b[1m\x1b[32m🔥 ✨${argBrand} brand✨ is set 🦄 🔥\x1b[39m\x1b[22m`);
  process.exit();
};

main();
