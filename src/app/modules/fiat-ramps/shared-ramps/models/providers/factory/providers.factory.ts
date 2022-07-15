import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { ProviderDataRepo } from '../../provider-data-repo/provider-data-repo';
import { environment } from '../../../../../../../environments/environment';
import { DefaultProviders } from '../default/default-providers';
import { PROVIDERS } from '../../../constants/providers';

@Injectable({ providedIn: 'root' })
export class ProvidersFactory {
  public create(http: HttpClient | FakeHttpClient, rawProviders = PROVIDERS, env: any = environment): DefaultProviders {
    return new DefaultProviders(new ProviderDataRepo(rawProviders), http, env);
  }
}
