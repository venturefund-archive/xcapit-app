import { Coin } from '../shared-wallets/interfaces/coin.interface';

export const COINS: Coin[] = [
  {
    id: 1,
    name: 'BTC - Bitcoin',
    logoRoute: '../../assets/img/coins/BTC.svg',
    last: false,
    value: 'BTC',
  },
  {
    id: 2,
    name: 'USDT - Tether',
    logoRoute: '../../assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
  },
  {
    id: 3,
    name: 'BNB - Binance',
    logoRoute: '../../assets/img/coins/BNB.svg',
    last: false,
    value: 'BNB',
  },
  {
    id: 4,
    name: 'ETH - Ethereum',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: true,
    value: 'ETH',
  },
  {
    id: 5,
    name: 'LTC- Litecoin',
    logoRoute: '../../assets/img/coins/LTC.svg',
    last: true,
    value: 'LTC',
  },
  {
    id: 6,
    name: 'DOGE- Dogecoin',
    logoRoute: '../../assets/img/coins/DOGE.svg',
    last: true,
    value: 'DOGE',
  },
  {
    id: 7,
    name: 'USDC- USD Coin',
    logoRoute: '../../assets/img/coins/USDC.svg',
    last: true,
    value: 'USDC',
  },
  {
    id: 8,
    name: 'PAX- Paxos Standard',
    logoRoute: '../../assets/img/coins/PAX.svg',
    last: true,
    value: 'PAX',
  },
];
