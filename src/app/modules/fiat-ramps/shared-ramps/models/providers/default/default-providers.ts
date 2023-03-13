import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { environment } from 'variables.env';
import { FiatRampProviderCountry } from '../../../interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../../../interfaces/fiat-ramp-provider.interface';
import { ProviderDataRepo } from '../../provider-data-repo/provider-data-repo';
import { Providers } from '../providers.interface';

export class DefaultProviders implements Providers {
  constructor(
    private readonly dataRepo: ProviderDataRepo,
    private readonly http: HttpClient | FakeHttpClient,
    private readonly env: any = environment,
  ) {}

  public all(): FiatRampProvider[] {
    return this.dataRepo.all()
  }

  public async availablesBy(aCountry: FiatRampProviderCountry, aCoin: Coin): Promise<FiatRampProvider[]> {
    let providers = this.dataRepo.byCountryAndCoin(aCountry, aCoin);
    const directaEnabled = providers.some((provider) => provider.providerName === 'directa24');
    if (aCountry.directaCode && directaEnabled) {
      const directaProviders = await this.availableDirectaProviders(aCountry).toPromise();
      providers = providers.filter(
        (provider) => directaProviders.some((dp) => dp.code === provider.alias) || provider.providerName !== 'directa24'
      );
    }
    return providers;
  }

  public byAlias(anAlias: string): FiatRampProvider {
    return this.all().find((provider) => provider.alias === anAlias);
  }

  public availableDirectaProviders(aCountry: FiatRampProviderCountry): Observable<any> {
    return this.http.get(`${this.env.directa24Url}payment_methods?country=${aCountry.directaCode}`, {
      headers: { Authorization: `Bearer ${this.env.directa24ApiKey}` },
    });
  }
}
