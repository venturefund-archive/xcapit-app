import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';
import { Providers } from '../providers/providers.interface';

export class ProviderTokensOf {
  constructor(
    private readonly _providers: Providers,
    private readonly _allCoins: Coin[],
    private readonly _fiatRampsService: FiatRampsService
  ) {}

  public async all(): Promise<Coin[]> {
    const availableKriptonCurrencies = await this._fiatRampsService.getKriptonAvailableCurrencies().toPromise();
    const mapResult = await Promise.all(this._allCoins.map(async (coin: Coin) => await this.tokensOf(this._providers.all(), coin, availableKriptonCurrencies)));
    return this._allCoins.filter((_, index) => mapResult[index]);
  }

  public async byAlias(anAlias: string): Promise<Coin[]> {
    let availableKriptonCurrencies = null;
    if(anAlias === 'kripton'){
      availableKriptonCurrencies = await this._fiatRampsService.getKriptonAvailableCurrencies().toPromise();
    }
    const mapResult = await Promise.all(this._allCoins.map(async (coin: Coin) => await this.tokensOf([this._providers.byAlias(anAlias)], coin, availableKriptonCurrencies)));
    return this._allCoins.filter((_, index) => mapResult[index]);
  }

  private async tokensOf(providers: FiatRampProvider[], coin: Coin, availableKriptonCurrencies: any[]) {
    const providerCurrencies = await Promise.all(
      providers.map(async (provider) => await this.providerCurrencies(provider, availableKriptonCurrencies))
    );
    return providerCurrencies.flat().some((token) => token.symbol === coin.value && token.network === coin.network);
  }

  async providerCurrencies(provider, availableKriptonCurrencies) {
    return provider.providerName === 'kripton' ? await this.getKriptonCoins(provider, availableKriptonCurrencies) : provider.currencies;
  }

  async getKriptonCoins(provider: FiatRampProvider, availableKriptonCurrencies: any[]) {
    if (availableKriptonCurrencies) {
      return provider.currencies.filter((currencie) =>
        availableKriptonCurrencies.some(
          (availableCoin) =>
            currencie.network === availableCoin.network && availableCoin.currencies.includes(currencie.symbol)
        )
      );
    }
  }
}