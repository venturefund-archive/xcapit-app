import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

export class ProviderDataRepo {
  constructor(private readonly remoteConfig: RemoteConfigService, private readonly transactionMode: string) {}

  public all(): FiatRampProvider[] {
    return this.providers();
  }

  public byCountry(aCountry: FiatRampProviderCountry): FiatRampProvider[] {
    return this.providers().filter((provider) => provider.countries.includes(aCountry.name));
  }

  public byCountryAndCoin(aCountry: FiatRampProviderCountry, aCoin: Coin) {
    return this.providers().filter(
      (provider) =>
        provider.countries.includes(aCountry.name) &&
        provider.currencies.some((curr) => curr.symbol === aCoin.value && curr.network === aCoin.network)
    );
  }

  private providers(): FiatRampProvider[] {
    const variable = this.transactionMode === 'sell' ? '  offRampsProviders' : 'onRampsProviders'
    return this.remoteConfig.getObject(variable);   
  }
  
}
