import { RawBlockchain } from "../blockchain-repo/blockchain-repo";


export const rawEthereumData: RawBlockchain = {
  name: 'ERC20',
  derivedPath: "m/44'/60'/0'/0/0",
  id: '1',
  rpc: 'https://ethereumRpc',
  nativeToken: {
    value: 'ETH',
    decimals: 18,
    chainId: 1,
    contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  }
};

export const rawPolygonData: RawBlockchain = {
  name: 'MATIC',
  derivedPath: "m/44'/966'/0'/0/0",
  id: '137',
  rpc: 'https://polygonRpc',
  gasPrice: 'PolygonGasPrice',
  nativeToken: {
    value: 'MATIC',
    decimals: 18,
    chainId: 137,
    contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  }
};

export const rawSolanaData: RawBlockchain = {
  name: 'SOLANA',
  derivedPath: "m/44'/501'/0'/0/0",
  id: '137',
  rpc: 'https://polygonRpc',
  nativeToken: {
    value: 'SOL',
    decimals: 18,
    chainId: 137,
    contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  }
};

export const rawBlockchainsData: RawBlockchain[] = [rawEthereumData, rawPolygonData, rawSolanaData];
