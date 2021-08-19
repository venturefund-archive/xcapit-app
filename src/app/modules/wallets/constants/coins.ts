import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { environment } from 'src/environments/environment';

export const COINS: Coin[] = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ETH',
    rpc: environment.ethAlchemyApiUrl,
  },
  {
    id: 2,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: '../../assets/img/coins/RBTC.png',
    last: true,
    value: 'RBTC',
    network: 'RSK',
    rpc: environment.rskApiUrl,
  },
];
