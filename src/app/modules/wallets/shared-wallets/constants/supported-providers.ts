import { environment } from 'src/environments/environment';

export interface IProviderData {
  name: string;
  short_name: string;
  chain: string;
  network: string;
  logo: string;
  chain_id: number;
  network_id: number;
  rpc_url: string;
  native_currency: IAssetData;
}

export interface IAssetData {
  symbol: string;
  name: string;
  decimals: string;
}

export const supportedProviders: IProviderData[] = [
  {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ERC20',
    network: 'mainnet',
    logo: 'assets/img/blockchains/ethereum.svg',
    chain_id: 1,
    network_id: 1,
    rpc_url: environment.ethAlchemyApiUrl,
    native_currency: {
      symbol: 'ETH',
      name: 'Ether',
      decimals: '18',
    },
  },
  {
    name: 'Ethereum Testnet',
    short_name: 'rin',
    chain: 'ERC20',
    network: 'testnet',
    chain_id: 4,
    network_id: 4,
    logo: 'assets/img/blockchains/ethereum.svg',
    rpc_url: environment.ethAlchemyApiUrl,
    native_currency: {
      symbol: 'ETH',
      name: 'Ether',
      decimals: '18',
    },
  },
  {
    name: 'RSK Mainnet',
    short_name: 'rBTC',
    chain: 'RSK',
    network: 'mainnet',
    chain_id: 30,
    network_id: 30,
    logo: 'assets/img/blockchains/rsk.svg',
    rpc_url: environment.rskApiUrl,
    native_currency: {
      symbol: 'rBTC',
      name: 'rBTC',
      decimals: '18',
    },
  },
  {
    name: 'RSK Testnet',
    short_name: 'trBTC',
    chain: 'RSK',
    network: 'testnet',
    chain_id: 31,
    network_id: 31,
    logo: 'assets/img/blockchains/rsk.svg',
    rpc_url: environment.rskApiUrl,
    native_currency: {
      symbol: 'trBTC',
      name: 'trBTC',
      decimals: '18',
    },
  },
  {
    name: 'Polygon Mainnet',
    short_name: 'Polygon',
    chain: 'MATIC',
    network: 'mainnet',
    chain_id: 137,
    network_id: 137,
    logo: 'assets/img/blockchains/polygon.svg',
    rpc_url: environment.maticApiUrl,
    native_currency: {
      symbol: 'MATIC',
      name: 'MATIC',
      decimals: '18',
    },
  },
  {
    name: 'Polygon Mumbai',
    short_name: 'Mumbai',
    chain: 'MATIC',
    network: 'testnet',
    chain_id: 80001,
    network_id: 80001,
    logo: 'assets/img/blockchains/polygon.svg',
    rpc_url: environment.maticApiUrl,
    native_currency: {
      symbol: 'MATIC',
      name: 'MATIC',
      decimals: '18',
    },
  },
  {
    name: 'Binance Smart Chain',
    short_name: 'BSC',
    chain: 'BSC_BEP20',
    network: 'testnet',
    chain_id: 97,
    network_id: 97,
    logo: '',
    rpc_url: environment.bscApiUrl,
    native_currency: {
      symbol: 'BNB',
      name: 'BNB',
      decimals: '18',
    },
  },
  {
    name: 'Binance Smart Chain',
    short_name: 'BSC',
    chain: 'BSC_BEP20',
    network: 'mainnet',
    chain_id: 56,
    network_id: 56,
    logo: '',
    rpc_url: environment.bscApiUrl,
    native_currency: {
      symbol: 'BNB',
      name: 'BNB',
      decimals: '18',
    },
  },
];
