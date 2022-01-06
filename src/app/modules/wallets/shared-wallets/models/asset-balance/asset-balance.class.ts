import { Coin } from '../../interfaces/coin.interface';

export class AssetBalanceClass {
  icon: string;
  symbol: string
  name: string
  amount: number;
  price: number;
  quoteSymbol: string;

  constructor(aCoin: Coin) {
    this.icon = aCoin.logoRoute;
    this.symbol = aCoin.value;
    this.name = aCoin.name
    this.amount = 0;
    this.price = 0;
    this.quoteSymbol = 'USD';
  }


}
