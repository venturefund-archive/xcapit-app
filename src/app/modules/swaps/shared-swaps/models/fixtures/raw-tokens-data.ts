export const rawETHData = {
  id: 1,
  name: 'ETH - Ethereum',
  logoRoute: 'assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  chainId: 1,
  rpc: '',
  moonpayCode: 'keth',
  contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
};

export const rawMATICData = {
  id: 17,
  name: 'MATIC - Polygon',
  logoRoute: 'assets/img/coins/MATIC.png',
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

export const rawTokensData = [rawETHData, rawMATICData, rawUSDCData, rawUSDTData];
