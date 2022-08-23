import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';

export interface Providers {
  all(): FiatRampProvider[];
  availablesBy(aCountry: FiatRampProviderCountry, aCoin: Coin): Promise<FiatRampProvider[]>;
  byAlias(anAlias: string): FiatRampProvider;
}
