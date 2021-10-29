import { Coin } from '../interfaces/coin.interface';
import { environment } from 'src/environments/environment';
import aaveAbi from './assets-abi-prod/aave-abi-prod.json';
import linkAbi from './assets-abi-prod/link-abi-prod.json';
import uniAbi from './assets-abi-prod/uni-abi-prod.json';
import usdtAbi from './assets-abi-prod/usdt-abi-prod.json';
import rifAbi from './assets-abi-prod/rif-abi-prod.json';
import sovAbi from './assets-abi-prod/sov-abi-prod.json';

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
    native: true,
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
    contract: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    abi: linkAbi,
    decimals: 18,
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
    contract: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    abi: aaveAbi,
    decimals: 18,
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
    contract: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    abi: uniAbi,
    decimals: 18,
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 30,
    rpc: environment.rskApiUrl,
    native: true,
  },
  {
    id: 7,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: false,
    value: 'RIF',
    network: 'RSK',
    chainId: 30,
    rpc: environment.rskApiUrl,
    contract: '0x2aCc95758f8b5F583470bA265Eb685a8f45fC9D5',
    abi: rifAbi,
    decimals: 18,
  },
  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.png',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 137,
    rpc: environment.maticApiUrl,
    decimals: 18,
    native: true,
  },
  {
    id: 9,
    name: 'SOV - Sovryn',
    logoRoute: 'assets/img/coins/SOV.png',
    last: true,
    value: 'SOV',
    network: 'RSK',
    chainId: 31,
    rpc: environment.rskApiUrl,
    contract: '0x6a9A07972D07E58f0daF5122D11e069288A375fB',
    abi: sovAbi,
    decimals: 18,
  },
];
