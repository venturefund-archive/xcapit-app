import { Coin } from '../interfaces/coin.interface';
import { environment } from 'src/environments/environment';
import aaveAbi from './assets-abi-prod/aave-abi-prod.json';
import linkAbi from './assets-abi-prod/link-abi-prod.json';
import uniAbi from './assets-abi-prod/uni-abi-prod.json';
import usdtAbi from './assets-abi-prod/usdt-abi-prod.json';
import rifAbi from './assets-abi-prod/rif-abi-prod.json';
import axsAbi from './assets-abi-prod/axs-abi-prod.json';
import manaAbi from './assets-abi-prod/mana-abi-prod.json';
import sushiAbi from './assets-abi-prod/sushi-abi-prod.json';
import compoundAbi from './assets-abi-prod/compound-abi-prod.json';
import enjAbi from './assets-abi-prod/enj-abi-prod.json';
import batAbi from './assets-abi-prod/bat-abi-prod.json';
import sandAbi from './assets-abi-prod/sand-abi-prod.json';
import crvAbi from './assets-abi-prod/crv-abi-prod.json';

export const PROD_COINS: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'eth',
    native: true,
    symbol: 'ETHUSDT',
    contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
  },
  {
    id: 2,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'link',
    contract: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
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
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'usdt',
    contract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
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
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'aave',
    contract: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    abi: aaveAbi,
    decimals: 18,
    symbol: 'AAVEUSDT',
  },
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: false,
    value: 'UNI',
    network: 'ERC20',
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'uni',
    contract: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
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
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    contract: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
    abi: axsAbi,
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
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'mana',
    contract: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    abi: manaAbi,
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
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    contract: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    abi: sushiAbi,
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
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    contract: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    abi: compoundAbi,
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
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    contract: '0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27',
    abi: linkAbi,
    decimals: 12,
    symbol: 'ZILUSDT',
  },
  {
    id: 12,
    name: 'ENJ - EnjinCoin',
    logoRoute: 'assets/img/coins/ENJ.png',
    last: false,
    value: 'ENJ',
    network: 'ERC20',
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    moonpayCode: 'enj',
    contract: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    abi: enjAbi,
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
    chainId: 1,
    rpc: environment.ethAlchemyApiUrl,
    contract: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    abi: batAbi,
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
    chainId: 30,
    rpc: environment.rskApiUrl,
    native: true,
    symbol: 'BTCUSDT',
    decimals: 18,
    contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    id: 15,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: false,
    value: 'RIF',
    network: 'RSK',
    chainId: 30,
    rpc: environment.rskApiUrl,
    contract: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
    abi: rifAbi,
    decimals: 18,
    symbol: 'RIFUSDT',
  },
  {
    id: 17,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.png',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 137,
    rpc: environment.maticApiUrl,
    moonpayCode: 'matic_polygon',
    decimals: 18,
    native: true,
    symbol: 'MATICUSDT',
    contract: '0x0000000000000000000000000000000000001010',
  },
  {
    id: 18,
    name: 'BNB - Binance Coin',
    logoRoute: 'assets/img/coins/BNB.svg',
    last: false,
    value: 'BNB',
    network: 'BSC_BEP20',
    chainId: 56,
    rpc: environment.bscApiUrl,
    moonpayCode: 'bnb_bsc',
    decimals: 18,
    native: true,
    symbol: 'BNBUSDT',
    contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    id: 19,
    name: 'CAKE - Pancake Swap',
    logoRoute: 'assets/img/coins/PANCAKE.png',
    last: true,
    value: 'CAKE',
    network: 'BSC_BEP20',
    chainId: 56,
    rpc: environment.bscApiUrl,
    contract: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    decimals: 18,
    symbol: 'CAKEUSDT',
    abi: linkAbi,
  },
  {
    id: 20,
    name: 'ADA - Cardano Token',
    logoRoute: 'assets/img/coins/ADA.png',
    last: false,
    value: 'ADA',
    network: 'BSC_BEP20',
    chainId: 56,
    rpc: environment.bscApiUrl,
    contract: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    decimals: 18,
    symbol: 'ADAUSDT',
    abi: linkAbi,
  },
  {
    id: 21,
    name: 'BUSD - BUSD Token',
    logoRoute: 'assets/img/coins/BUSD.png',
    last: false,
    value: 'BUSD',
    network: 'BSC_BEP20',
    chainId: 56,
    rpc: environment.bscApiUrl,
    contract: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    decimals: 18,
    symbol: 'BUSDUSDT',
    abi: linkAbi,
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
    contract: '0x1ce0c2827e2ef14d5c4f29a091d735a204794041',
    decimals: 18,
    symbol: 'AVAXUSDT',
    abi: linkAbi,
  },
  {
    id: 23,
    name: 'SAND - SAND Token',
    logoRoute: 'assets/img/coins/SAND.png',
    last: false,
    value: 'SAND',
    network: 'MATIC',
    chainId: 137,
    rpc: environment.maticApiUrl,
    contract: '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683',
    abi: sandAbi,
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
    chainId: 137,
    rpc: environment.maticApiUrl,
    moonpayCode: 'usdc_polygon',
    contract: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    abi: linkAbi,
    decimals: 6,
    symbol: 'USDCUSDT',
  },
  {
    id: 25,
    name: 'CRV - Curve',
    logoRoute: 'assets/img/coins/CRV.png',
    last: false,
    value: 'CRV',
    network: 'MATIC',
    chainId: 137,
    rpc: environment.maticApiUrl,
    abi: crvAbi,
    contract: '0x172370d5cd63279efa6d502dab29171933a610af',
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
    chainId: 137,
    rpc: environment.maticApiUrl,
    abi: linkAbi,
    contract: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    decimals: 18,
    symbol: 'USDTDAI',
  },
  {
    id: 27,
    name: 'WETH - Wrapped Ether',
    logoRoute: 'assets/img/coins/WETH.svg',
    last: false,
    value: 'WETH',
    network: 'MATIC',
    chainId: 137,
    rpc: environment.maticApiUrl,
    abi: linkAbi,
    contract: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    decimals: 18,
    symbol: 'ETHUSDT',
  },
  {
    id: 28,
    name: 'WBTC - Wrapped BTC',
    logoRoute: 'assets/img/coins/WBTC.png',
    last: true,
    value: 'WBTC',
    network: 'MATIC',
    chainId: 137,
    rpc: environment.maticApiUrl,
    abi: linkAbi,
    contract: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    decimals: 8,
    symbol: 'BTCUSDT',
  },
];