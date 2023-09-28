export const rawApproveData = {
  data: '0x095ea7b30000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d000000000000000000000000000000000000000000000000000000174876e800',
  gasPrice: '48560296835',
  to: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  value: '0',
};

export const rawSwapData = {
  fromToken: {
    symbol: 'MATIC',
    name: 'MATIC',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png',
  },
  toToken: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
  },
  toTokenAmount: '10244',
  fromTokenAmount: '10000000000000000',
  protocols: [
    [
      [
        {
          name: 'POLYGON_SUSHISWAP',
          part: 100,
          fromTokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
          toTokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        },
      ],
    ],
  ],
  tx: {
    from: '0x39D77e51c485F1ff65b1b3B42e9f67CdA221F597',
    to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
    data: '0x7c025200000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc300000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000180000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc300000000000000000000000039d77e51c485f1ff65b1b3b42e9f67cda221f597000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000000000000000279d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006e00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000003400000000000000000000000000000000000000000000000000000000000000480000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064d1660f99000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000039d77e51c485f1ff65b1b3b42e9f67cda221f59700000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000000000000000000000000232bff5f46c00000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004d0e30db000000000000000000000000000000000000000000000000000000000000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064d1660f990000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000cd353f79d9fade311fc3119b841e1f456b54e85800000000000000000000000000000000000000000000000000232bff5f46c00000000000000000000000000000000000000000000000000000000000800000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a4b757fed6000000000000000000000000cd353f79d9fade311fc3119b841e1f456b54e8580000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000002dc6c0521709b3cd7f07e29722be0ba28a8ce0e806dbc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018414284aab000000000000000000000000000000000000000000000000000000000000008080000000000000000000000000000000000000000000000000000000000000440000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000100000000000000000000000000000001000000000000000000000000521709b3cd7f07e29722be0ba28a8ce0e806dbc3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000064d1660f990000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000001111111254fb6c44bac0bed2854e76f90643097d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cfee7c08',
    value: '10000000000000000',
    gas: 317439,
    gasPrice: '85191504432',
  },
};

export const rawETHTokenData = {
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
};

export const rawMATICTokenData = {
  symbol: 'MATIC',
  name: 'MATIC',
  decimals: 18,
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png',
};

export const rawUSDCTokenData = {
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

export const rawUMATokenData = {
  symbol: 'UMA',
  name: 'UMA Voting Token v1',
  decimals: 18,
  address: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
  logoURI: 'https://tokens.1inch.io/0x04fa0d235c4abf4bcf4787af4cf447de572ef828.png',
};

export const rawSTXTokenData = {
  symbol: 'STX',
  name: 'Stox',
  address: '0x006bea43baa3f7a6f765f14f10a1a1b08334ef45',
  decimals: 18,
  logoURI: 'https://tokens.1inch.io/0x006bea43baa3f7a6f765f14f10a1a1b08334ef45.png',
};

export const rawEthereumTokensData = {
  tokens: {
    '0x006bea43baa3f7a6f765f14f10a1a1b08334ef45': rawSTXTokenData,
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': rawETHTokenData,
    '0x04fa0d235c4abf4bcf4787af4cf447de572ef828': rawUMATokenData,
  },
};

export const rawNotAllowanceData = {
  allowance: '0',
};

export const rawAllowanceData = {
  allowance: '1000000000000000000',
};

export const rawALotAllowanceData = {
  allowance: '100000000000000000000',
};

type RawSwapTokenInfo = {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI: string;
  tags: string[];
};

type RawSwapInfo = {
  toAmount: string;
  gas: number;
  // fromToken: RawSwapTokenInfo;
  // toToken: RawSwapTokenInfo;
};

export const rawSwapOneInchInfoData: RawSwapInfo = {
  toAmount: '495454',
  gas: 229386,
  // fromToken: {
  //   symbol: 'DAI',
  //   name: '(PoS) Dai Stablecoin',
  //   decimals: 18,
  //   address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  //   logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  //   tags: ['tokens', 'PEG:USD'],
  // },
  // toToken: {
  //   symbol: 'USDC',
  //   name: 'USD Coin (PoS)',
  //   decimals: 6,
  //   address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  //   logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
  //   tags: ['tokens', 'PEG:USD'],
  // },
};
