import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { ProviderDataRepo } from '../../provider-data-repo/provider-data-repo';
import { environment } from '../../../../../../../environments/environment';
import { DefaultProviders } from '../default/default-providers';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Injectable({ providedIn: 'root' })
export class ProvidersFactory {
  public create(
    remoteConfig: RemoteConfigService,
    http: HttpClient | FakeHttpClient,
    env: any = environment
  ): DefaultProviders {
    return new DefaultProviders(new ProviderDataRepo(remoteConfig), http, env);
  }
}
