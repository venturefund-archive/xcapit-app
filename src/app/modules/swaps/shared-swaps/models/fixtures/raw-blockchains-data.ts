export const rawEthereumData = {
  name: 'ERC20',
  derivedPath: "m/44'/60'/0'/0/0",
  id: '1',
  rpc: 'https://ethereumRpc'
};

export const rawPolygonData = {
  name: 'MATIC',
  derivedPath: "m/44'/966'/0'/0/0",
  id: '137',
  rpc: 'https://polygonRpc'
};

export const rawBlockchainsData = [rawEthereumData, rawPolygonData];
