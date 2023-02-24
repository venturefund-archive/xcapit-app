import { environment } from '../../../../../../environments/environment';

export const rawETHData = {
  id: 1,
  name: 'ETH - Ethereum',
  logoRoute: 'assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  chainId: 1,
  rpc: '',
  moonpayCode: 'eth',
  contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  decimals: 18,
  native: true,
  symbol: 'ETHUSDT',
};

export const rawUSDTData = {
  id: 3,
  name: 'USDT - Tether',
  logoRoute: 'assets/img/coins/USDT.svg',
  last: false,
  value: 'USDT',
  network: 'ERC20',
  chainId: 1,
  rpc: '',
  moonpayCode: 'usdt',
  contract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  abi: '',
  decimals: 6,
};

export const rawUSDCData = {
  id: 24,
  name: 'USDC - USD Coin',
  logoRoute: 'assets/img/coins/USDC.png',
  last: false,
  value: 'USDC',
  network: 'MATIC',
  chainId: 137,
  rpc: '',
  moonpayCode: 'usdc_polygon',
  contract: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  abi: '',
  decimals: 6,
  symbol: 'USDCUSDT',
  canInvest: true
};

export const rawMATICData = {
  id: 17,
  name: 'MATIC - Polygon',
  logoRoute: 'assets/img/coins/MATIC.svg',
  last: false,
  value: 'MATIC',
  network: 'MATIC',
  chainId: 137,
  rpc: '',
  moonpayCode: 'matic_polygon',
  decimals: 18,
  native: true,
  symbol: 'MATICUSDT',
  contract: '0x0000000000000000000000000000000000001010',
};

export const rawSOLData = {
  id: 29,
  name: 'SOL - Solana',
  logoRoute: 'assets/img/coins/SOL.svg',
  last: false,
  value: 'SOL',
  network: 'SOLANA',
  contract: '11111111111111111111111111111111',
  chainId: 1399811149,
  rpc: '',
  decimals: 9,
  native: true,
  abi: '',
  symbol: 'SOL',
};

export const rawSAMOData = {
  id: 30,
  name: 'SAMO - Samoyed Coin',
  logoRoute: 'assets/img/coins/SOL.svg',
  last: true,
  value: 'SAMO',
  network: 'SOLANA',
  contract: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  chainId: 1399811149,
  rpc: environment.solanaApiUrl,
  decimals: 9,
  native: false,
  abi: '',
  symbol: 'SAMO',
};

export const rawSRMData = {
  id: 31,
  name: 'Serum - SRM',
  logoRoute:
  'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png',
  last: true,
  value: 'SRM',
  network: 'SOLANA',
  contract: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
  chainId: 1399811149,
  rpc: environment.solanaApiUrl,
  decimals: 6,
  native: false,
  abi: '',
  symbol: 'SRM',
}

export const rawTokensData = [rawETHData, rawMATICData, rawUSDCData, rawUSDTData, rawSOLData, rawSAMOData, rawSRMData];
