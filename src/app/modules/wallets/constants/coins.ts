import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { environment } from 'src/environments/environment';
import aaveAbi from './assets-abi/aave-abi.json';
import linkAbi from './assets-abi/link-abi.json';
import uniAbi from './assets-abi/uni-abi.json';
import usdtAbi from './assets-abi/usdt-abi.json';
import rifAbi from './assets-abi/rif-abi.json';

export const COINS: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    rpc: environment.ethAlchemyApiUrl,
  },
  {
    id: 2,
    name: 'LINK - Chainlink',
    logoRoute: '../../assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    rpc: environment.ethAlchemyApiUrl,
    contract: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    abi: linkAbi,
    decimals: 18,
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: '../../assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    rpc: environment.ethAlchemyApiUrl,
    contract: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
    abi: usdtAbi,
    decimals: 6,
  },
  {
    id: 4,
    name: 'AAVE',
    logoRoute: '../../assets/img/coins/AAVE.svg',
    last: false,
    value: 'AAVE',
    network: 'ERC20',
    rpc: environment.ethAlchemyApiUrl,
    contract: '0x42447D5f59d5BF78a82C34663474922bdf278162',
    abi: aaveAbi,
    decimals: 18,
  },
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: '../../assets/img/coins/UNI.svg',
    last: false,
    value: 'UNI',
    network: 'ERC20',
    rpc: environment.ethAlchemyApiUrl,
    contract: '0xf2e3c830C6220795C6e101492BD1b98fb122AC01',
    abi: uniAbi,
    decimals: 18,
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: '../../assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    rpc: environment.rskApiUrl,
  },
  {
    id: 6,
    name: 'RIF - Rifos',
    logoRoute: '../../assets/img/coins/RIF.png',
    last: true,
    value: 'RIF',
    network: 'RSK',
    rpc: environment.rskApiUrl,
    contract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    abi: rifAbi,
    decimals: 18,
  },
];
