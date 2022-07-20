import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

export class ProviderDataRepo {
  constructor(private readonly remoteConfig: RemoteConfigService) {}

  public all(): FiatRampProvider[] {
    return this.providers();
  }

  public byCountry(aCountry: FiatRampProviderCountry): FiatRampProvider[] {
    return this.providers().filter((provider) => provider.countries.includes(aCountry.name));
  }

  private providers(): FiatRampProvider[] {
    return this.remoteConfig.getObject('onOffRampsProviders');
  }
}
