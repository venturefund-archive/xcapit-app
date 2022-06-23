import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';

export class FiatRampCurrenciesOf {
  constructor(private readonly _aProvider: FiatRampProvider, private readonly _allCoins: Coin[]) {}

  public value(): Coin[] {
    return this._allCoins.filter((coin: Coin) => this.byProvider(coin));
  }

  private byProvider(coin: Coin): boolean {
    return this._aProvider.currencies.some((token) => token.symbol === coin.value && token.network === coin.network);
  }
}
