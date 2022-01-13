import { Coin } from '../interfaces/coin.interface';
import { environment } from 'src/environments/environment';
import aaveAbi from './assets-abi/aave-abi.json';
import linkAbi from './assets-abi/link-abi.json';
import uniAbi from './assets-abi/uni-abi.json';
import usdtAbi from './assets-abi/usdt-abi.json';
import rifAbi from './assets-abi/rif-abi.json';
import busdAbi from './assets-abi/busd-abi.json';
import cakeAbi from './assets-abi/cake-abi.json';
import adaAbi from './assets-abi/ada-abi.json';
export const NONPROD_COINS: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'keth',
    native: true,
    symbol: 'ETHUSDT',
  },
  {
    id: 2,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'link',
    contract: '0xa36085f69e2889c224210f603d836748e7dc0088',
    abi: linkAbi,
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
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'usdt',
    contract: '0x07de306ff27a2b630b1141956844eb1552b956b5',
    abi: usdtAbi,
    decimals: 6,
  },
  {
    id: 4,
    name: 'AAVE',
    logoRoute: 'assets/img/coins/AAVE.svg',
    last: false,
    value: 'AAVE',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'aave',
    contract: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    abi: aaveAbi,
    decimals: 18,
    symbol: 'AAVEUSDT',
  },
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: true,
    value: 'UNI',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'uni',
    contract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    abi: uniAbi,
    decimals: 18,
    symbol: 'UNIUSDT',
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: environment.rskApiUrl,
    native: true,
    symbol: 'BTCUSDT',
  },
  {
    id: 7,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: true,
    value: 'RIF',
    network: 'RSK',
    chainId: 31,
    rpc: environment.rskApiUrl,
    contract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    abi: rifAbi,
    decimals: 18,
    symbol: 'RIFUSDT',
  },

  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.png',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    moonpayCode: 'matic_polygon',
    decimals: 18,
    native: true,
    symbol: 'MATICUSDT',
  },
  {
    id: 10,
    name: 'BNB - Binance Coin',
    logoRoute: 'assets/img/coins/BNB.svg',
    last: false,
    value: 'BNB',
    network: 'BSC_BEP20',
    chainId: 97,
    rpc: environment.bscApiUrl,
    moonpayCode: 'bnb_bsc',
    decimals: 18,
    native: true,
    symbol: 'BNBUSDT',
  },
  {
    id: 11,
    name: 'CAKE - Pancake Swap',
    logoRoute: 'assets/img/coins/PANCAKE.png',
    last: false,
    value: 'CAKE',
    network: 'BSC_BEP20',
    chainId: 97,
    rpc: environment.bscApiUrl,
    contract: '0xF9f93cF501BFaDB6494589Cb4b4C15dE49E85D0e',
    abi: cakeAbi,
    decimals: 18,
    symbol: 'CAKEUSDT',
  },
  {
    id: 12,
    name: 'ADA - Cardano Token',
    logoRoute: 'assets/img/coins/ADA.png',
    last: false,
    value: 'ADA',
    network: 'BSC_BEP20',
    chainId: 97,
    rpc: environment.bscApiUrl,
    contract: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    abi: adaAbi,
    decimals: 18,
    symbol: 'ADAUSDT',
  },
  {
    id: 13,
    name: 'BUSD - Binance USD',
    logoRoute: 'assets/img/coins/BUSD.png',
    last: false,
    value: 'BUSD',
    network: 'BSC_BEP20',
    chainId: 97,
    rpc: environment.bscApiUrl,
    contract: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7',
    abi: busdAbi,
    decimals: 18,
    symbol: 'BUSDUSDT',
  },
  {
    id: 14,
    name: 'SAND - SAND Token',
    logoRoute: 'assets/img/coins/SAND.png',
    last: false,
    value: 'SAND',
    network: 'MATIC',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    decimals: 18,
    symbol: 'SANDUSDT',
  },
  {
    id: 15,
    name: 'USDC - USD Coin',
    logoRoute: 'assets/img/coins/USDC.png',
    last: false,
    value: 'USDC',
    network: 'MATIC',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    moonpayCode: 'usdc_polygon',
    decimals: 18,
    symbol: 'USDCUSDT',
  },
  {
    id: 16,
    name: 'CRV - Curve',
    logoRoute: 'assets/img/coins/CRV.png',
    last: true,
    value: 'CRV',
    network: 'MATIC',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    decimals: 18,
    symbol: 'CRVUSDT',
  },
];
