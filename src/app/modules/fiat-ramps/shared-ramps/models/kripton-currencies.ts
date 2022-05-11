import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { PROVIDERS } from '../constants/providers';

export class KriptonCurrencies {
  constructor(
    private readonly _allCoins: Coin[],
    private readonly _kriptonCoinList: { symbol: string; network: string }[]
  ) {}

  public static create(allCoins: Coin[]): KriptonCurrencies {
    return new this(allCoins, PROVIDERS.find((provider) => provider.alias === 'kripton').currencies);
  }

  public value(): Coin[] {
    return this._allCoins.filter((coin) => {
      return this._kriptonCoinList.some((kCoin) => {
        return kCoin.symbol === coin.value && kCoin.network === coin.network;
      });
    });
  }
}
