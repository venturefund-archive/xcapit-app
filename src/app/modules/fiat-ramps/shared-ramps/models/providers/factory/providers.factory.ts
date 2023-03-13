import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProviderDataRepo } from '../../provider-data-repo/provider-data-repo';
import { environment } from '../../../../../../../environments/environment';
import { DefaultProviders } from '../default/default-providers';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Injectable({ providedIn: 'root' })
export class ProvidersFactory {
  constructor(private remoteConfig: RemoteConfigService, private http: HttpClient) {}
  public create(mode: string = 'buy', env: any = environment): DefaultProviders {
    return new DefaultProviders(new ProviderDataRepo(this.remoteConfig, mode), this.http, env);
  }
}
