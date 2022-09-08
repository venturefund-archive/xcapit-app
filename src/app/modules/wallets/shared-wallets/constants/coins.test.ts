import { Coin } from '../interfaces/coin.interface';

export const TEST_ERC20_COINS: Coin[] = [
  {
    id: 0,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    moonpayCode: 'keth',
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 1,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    contract: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    decimals: 18,
  },
  {
    id: 2,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    moonpayCode: 'usdt',
    rpc: 'http://testrpc.text/',
    contract: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
    decimals: 6,
  },
  {
    id: 3,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: false,
    value: 'UNI',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.text/',
    contract: '0xf2e3c830C6220795C6e101492BD1b98fb122AC01',
    decimals: 18,
  },
];

export const TEST_RSK_COINS: Coin[] = [
  {
    id: 4,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    native: true,
  },
  {
    id: 5,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: false,
    value: 'RIF',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    contract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    decimals: 18,
  },
];

export const TEST_MATIC_COINS: Coin[] = [
  {
    id: 6,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.svg',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    moonpayCode: 'matic_polygon',
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

export const TEST_BSC_BEP20_COINS: Coin[] = [
  {
    id: 7,
    name: 'BNB - Binance Coin',
    logoRoute: 'assets/img/coins/BNB.svg',
    last: true,
    value: 'BNB',
    network: 'BSC_BEP20',
    chainId: 97,
    moonpayCode: 'bnb_bsc',
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

export const TEST_SOLANA_COINS: Coin[] = [
  {
    id: 8,
    name: 'SOL - Solana',
    logoRoute: 'assets/img/coins/SOL.svg',
    last: true,
    value: 'SOL',
    network: 'SOLANA',
    chainId: 97,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

export const TEST_COINS: Coin[] = [
  ...TEST_ERC20_COINS,
  ...TEST_RSK_COINS,
  ...TEST_MATIC_COINS,
  ...TEST_BSC_BEP20_COINS,
  ...TEST_SOLANA_COINS
];
