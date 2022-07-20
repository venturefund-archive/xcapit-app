import { PROVIDERS } from '../../constants/providers';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

export class ProviderDataRepo {
  constructor(private readonly providers: FiatRampProvider[] = PROVIDERS) {}

  all(): FiatRampProvider[] {
    return this.providers;
  }

  byCountry(aCountry: FiatRampProviderCountry) {
    return this.providers.filter((provider) => provider.countries.includes(aCountry.name));
  }

  byCountryAndCoin(aCountry: FiatRampProviderCountry, aCoin: Coin) {
    return this.providers.filter(
      (provider) =>
        provider.countries.includes(aCountry.name) &&
        provider.currencies.some((curr) => curr.symbol === aCoin.value && curr.network === aCoin.network)
    );
  }
}
