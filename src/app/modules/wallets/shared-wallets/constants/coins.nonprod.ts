import { Coin } from '../interfaces/coin.interface';
import { environment } from 'src/environments/environment';
import linkAbi from './assets-abi/link-abi.json';
import uniAbi from './assets-abi/uni-abi.json';
import usdtAbi from './assets-abi/usdt-abi.json';
import rifAbi from './assets-abi/rif-abi.json';
import busdAbi from './assets-abi/busd-abi.json';
import cakeAbi from './assets-abi/cake-abi.json';
import adaAbi from './assets-abi/ada-abi.json';
import { last } from 'rxjs/operators';



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
    name: 'LUNA',
    logoRoute: 'assets/img/coins/LUNA.png',
    last: false,
    value: 'LUNA',
    network: 'ERC20',
    chainId: 42,
    rpc: environment.ethAlchemyApiUrl,
    decimals: 18,
    symbol: 'LUNAUSDT',
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
    contract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    abi: rifAbi,
    decimals: 18,
    symbol: 'RIFUSDT',
  },

  {
    id: 16,
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
    contract: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7',
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
    chainId: 56,
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
    contract: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
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
    chainId: 80001,
    rpc: environment.maticApiUrl,
    decimals: 18,
  },
  {
    id: 27,
    name: 'WETH - Wrapped Ether',
    logoRoute: 'assets/img/coins/WETH.svg',
    last: true,
    value: 'WETH',
    network: 'MATIC',
    chainId: 80001,
    rpc: environment.maticApiUrl,
    decimals: 18,
  },
];
