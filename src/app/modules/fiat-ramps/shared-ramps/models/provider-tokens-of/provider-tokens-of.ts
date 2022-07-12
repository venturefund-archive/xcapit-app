import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { Providers } from '../providers/providers.interface';

export class ProviderTokensOf {
  constructor(private readonly _providers: Providers, private readonly _allCoins: Coin[]) {}

  public all(): Coin[] {
    return this._allCoins.filter((coin: Coin) => this.tokensOf(this._providers.all(), coin));
  }

  public byAlias(anAlias: string): Coin[] {
    return this._allCoins.filter((coin: Coin) => this.tokensOf([this._providers.byAlias(anAlias)], coin));
  }

  private tokensOf(providers: FiatRampProvider[], coin: Coin) {
    return providers
      .map((provider) => provider.currencies)
      .flat()
      .some((token) => token.symbol === coin.value && token.network === coin.network);
  }
}
