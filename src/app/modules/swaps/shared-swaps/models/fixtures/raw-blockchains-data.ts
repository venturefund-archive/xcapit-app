import { RawBlockchain } from "../blockchain-repo/blockchain-repo";


export const rawEthereumData: RawBlockchain = {
  name: 'ERC20',
  derivedPath: "m/44'/60'/0'/0/0",
  id: '1',
  rpc: 'https://ethereumRpc'
};

export const rawPolygonData: RawBlockchain = {
  name: 'MATIC',
  derivedPath: "m/44'/966'/0'/0/0",
  id: '137',
  rpc: 'https://polygonRpc',
  gasPrice: 'PolygonGasPrice'
};

export const rawBlockchainsData: RawBlockchain[] = [rawEthereumData, rawPolygonData];
