import { PROVIDERS } from '../../constants/providers';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';

export class ProviderDataRepo {
  constructor(private readonly providers: FiatRampProvider[] = PROVIDERS) {}

  all(): FiatRampProvider[] {
    return this.providers;
  }

  byCountry(aCountry: FiatRampProviderCountry) {
    return this.providers.filter((provider) => provider.countries.includes(aCountry.name));
  }
}