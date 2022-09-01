import { Coin } from '../interfaces/coin.interface';
import { environment } from 'src/environments/environment';
import linkAbi from './assets-abi/link-abi.json';
import uniAbi from './assets-abi/uni-abi.json';
import usdtAbi from './assets-abi/usdt-abi.json';
import rifAbi from './assets-abi/rif-abi.json';
import busdAbi from './assets-abi/busd-abi.json';
import cakeAbi from './assets-abi/cake-abi.json';
import adaAbi from './assets-abi/ada-abi.json';
import wethAbi from './assets-abi/weth-abi.json';
import daiAbi from './assets-abi/dai-abi.json';

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
    contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
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
    id: 7,
    name: 'AXS - Axie Infinity Shard',
    logoRoute: 'assets/img/coins/AXS.png',
    last: false,
    value: 'AXS',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    decimals: 18,
    symbol: 'AXSUSDT',
  },
  {
    id: 8,
    name: 'MANA - Decentraland',
    logoRoute: 'assets/img/coins/MANA.png',
    last: false,
    value: 'MANA',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'mana',
    decimals: 18,
    symbol: 'MANAUSDT',
  },
  {
    id: 9,
    name: 'SUSHI',
    logoRoute: 'assets/img/coins/SUSHI.png',
    last: false,
    value: 'SUSHI',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    decimals: 18,
    symbol: 'SUSHIUSDT',
  },
  {
    id: 10,
    name: 'COMPOUND',
    logoRoute: 'assets/img/coins/COMPOUND.png',
    last: false,
    value: 'COMP',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    decimals: 18,
    symbol: 'COMPUSDT',
  },
  {
    id: 11,
    name: 'ZIL - Zilliqa',
    logoRoute: 'assets/img/coins/ZILLIQA.png',
    last: false,
    value: 'ZIL',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    decimals: 18,
    symbol: 'ZILUSDT',
  },
  {
    id: 12,
    name: 'ENJ - EnjinCoin',
    logoRoute: 'assets/img/coins/ENJ.png',
    last: false,
    value: 'ENJ',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'enj',
    decimals: 18,
    symbol: 'ENJUSDT',
  },
  {
    id: 13,
    name: 'BAT',
    logoRoute: 'assets/img/coins/BAT.png',
    last: true,
    value: 'BAT',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    decimals: 18,
    symbol: 'BATUSDT',
  },
  {
    id: 14,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: environment.rskApiUrl,
    native: true,
    symbol: 'BTCUSDT',
    decimals: 18,
    contract: '0xrsktzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  },
  {
    id: 15,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: true,
    value: 'RIF',
    network: 'RSK',
    chainId: 31,
    rpc: environment.rskApiUrl,
    contract: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    abi: rifAbi,
    decimals: 18,
    symbol: 'RIFUSDT',
  },
  {
    id: 16,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.svg',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    moonpayCode: 'matic_polygon',
    decimals: 18,
    native: true,
    contract: '0x0000000000000000000000000000000000001010',
    symbol: 'MATICUSDT',
  },
  {
    id: 18,
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
    contract: '0xtzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  },
  {
    id: 19,
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
    id: 20,
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
    id: 21,
    name: 'BUSD - Binance USD',
    logoRoute: 'assets/img/coins/BUSD.png',
    last: false,
    value: 'BUSD',
    network: 'BSC_BEP20',
    chainId: 97,
    rpc: environment.bscApiUrl,
    contract: '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7',
    abi: busdAbi,
    decimals: 18,
    symbol: 'BUSDUSDT',
  },
  {
    id: 22,
    name: 'AVAX - Avalanche Token',
    logoRoute: 'assets/img/coins/AVAX.png',
    last: false,
    value: 'AVAX',
    network: 'BSC_BEP20',
    chainId: 97,
    rpc: environment.bscApiUrl,
    decimals: 18,
    symbol: 'AVAXUSDT',
  },
  {
    id: 23,
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
    id: 24,
    name: 'USDC - USD Coin',
    logoRoute: 'assets/img/coins/USDC.png',
    last: false,
    value: 'USDC',
    network: 'MATIC',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    moonpayCode: 'usdc_polygon',
    contract: '0x2058a9d7613eee744279e3856ef0eada5fcbaa7e',
    abi: linkAbi,
    decimals: 6,
    symbol: 'USDCUSDT',
  },
  {
    id: 25,
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
  {
    id: 26,
    name: 'DAI - DAI',
    logoRoute: 'assets/img/coins/DAI.png',
    last: false,
    value: 'DAI',
    network: 'MATIC',
    contract: '0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    decimals: 18,
    abi: daiAbi,
    symbol: 'USDTDAI',
  },
  {
    id: 27,
    name: 'WETH - Wrapped Ether',
    logoRoute: 'assets/img/coins/WETH.svg',
    last: false,
    value: 'WETH',
    network: 'MATIC',
    contract: '0x3c68ce8504087f89c640d02d133646d98e64ddd9',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    decimals: 18,
    abi: wethAbi,
    symbol: 'ETHUSDT',
  },
  {
    id: 28,
    name: 'WBTC - Wrapped BTC',
    logoRoute: 'assets/img/coins/WBTC.png',
    last: true,
    value: 'WBTC',
    network: 'MATIC',
    contract: '0x0d787a4a1548f673ed375445535a6c7a1ee56180',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    decimals: 8,
    abi: linkAbi,
    symbol: 'BTCUSDT',
  },

  {
    id: 29,
    name: 'SOL - Solana',
    logoRoute: 'assets/img/coins/SOL.svg',
    last: true,
    value: 'SOL',
    network: 'SOLANA',
    contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chainId: 666,
    rpc: environment.solanaApiUrl,
    decimals: 8,
    native: true,
    abi: '',
    symbol: 'SOL',
  },
];
