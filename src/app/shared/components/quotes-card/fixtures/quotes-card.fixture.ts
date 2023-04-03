import { Quotes } from '../../../../shared/interfaces/quotes.interface';

export const totalQuotes: Quotes[] = [
  {
    symbol: 'BTCUSDT',
    tokenName: 'Bitcoin',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'ETHUSDT',
    tokenName: 'Ethereum',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'MATICUSDT',
    tokenName: 'Polygon',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'BNBUSDT',
    tokenName: 'Binance Coin',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'AAVEUSDT',
    tokenName: 'AAVE',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'UNIUSDT',
    tokenName: 'Uniswap',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'USDCUSDT',
    tokenName: 'USD Coin',
    openPrice: 0,
    lastPrice: 0,
    priceChangePercent: 0,
  },
];

export const firstNativeQuotes = [
  {
    symbol: 'BTCUSDT',
    tokenName: 'Bitcoin',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'ETHUSDT',
    tokenName: 'Ethereum',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'MATICUSDT',
    tokenName: 'Polygon',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

export const remainingNativeQuotes = [
  {
    symbol: 'BNBUSDT',
    tokenName: 'Binance Coin',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

//User Quotes
export const userQuotes = [
  {
    symbol: 'BNBUSDT',
    tokenName: 'Binance Coin',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'AAVEUSDT',
    tokenName: 'AAVE',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'UNIUSDT',
    tokenName: 'Uniswap',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'USDCUSDT',
    tokenName: 'USD Coin',
    openPrice: 0,
    lastPrice: 0,
    priceChangePercent: 0,
  },
];

export const firstUserQuotes = [
  {
    symbol: 'BNBUSDT',
    tokenName: 'Binance Coin',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'AAVEUSDT',
    tokenName: 'AAVE',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'UNIUSDT',
    tokenName: 'Uniswap',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
];

export const remainingUserQuotes = [
  {
    symbol: 'BNBUSDT',
    tokenName: 'Binance Coin',
    openPrice: 46000,
    lastPrice: 47585,
    priceChangePercent: 0.24,
  },
  {
    symbol: 'USDCUSDT',
    tokenName: 'USD Coin',
    openPrice: 0,
    lastPrice: 1,
    priceChangePercent: -0.2,
  },
];

export const usdcQuote = {
  market_data: {
    current_price: {
      usd: 1,
    },
    price_change_percentage_24h_in_currency: {
      usd: -0.2,
    },
  },
};

export const coins = [
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    value: 'RBTC',
    network: 'RSK',
    native: true,
    symbol: 'BTCUSDT',
  },
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    value: 'ETH',
    network: 'ERC20',
    native: true,
    symbol: 'ETHUSDT',
  },
  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.svg',
    value: 'MATIC',
    network: 'MATIC',
    native: true,
    symbol: 'MATICUSDT',
  },
  {
    id: 10,
    name: 'BNB - Binance Coin',
    logoRoute: 'assets/img/coins/BNB.svg',
    value: 'BNB',
    network: 'BSC_BEP20',
    native: true,
    symbol: 'BNBUSDT',
  },
  {
    id: 2,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    decimals: 18,
    symbol: 'LINKUSDT',
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
  },
  {
    id: 5,
    name: 'USDC - Usd coin',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    symbol: 'USDCUSDT',
  },
];
