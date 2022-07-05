import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { ProviderDataRepo } from '../../provider-data-repo/provider-data-repo';
import { Providers } from '../providers';
import { environment } from '../../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProvidersFactory {
  public create(dataRepo: ProviderDataRepo, http: HttpClient | FakeHttpClient, env: any = environment): Providers {
    return new Providers(dataRepo, http, env);
  }
}
