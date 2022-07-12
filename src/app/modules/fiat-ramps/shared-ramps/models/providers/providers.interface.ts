import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';

export interface Providers {
  all(): FiatRampProvider[];
  availablesBy(aCountry: FiatRampProviderCountry): Promise<FiatRampProvider[]>;
  byAlias(anAlias: string): FiatRampProvider;
}
