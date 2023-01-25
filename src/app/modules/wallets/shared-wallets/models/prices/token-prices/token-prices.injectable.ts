import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { environment } from '../../../../../../../environments/environment';
import { TokenPrices } from './token-prices';
import { Tokens } from 'src/app/modules/swaps/shared-swaps/models/tokens/tokens';

@Injectable({ providedIn: 'root' })
export class TokenPricesInjectable {
  constructor(private httpClient: HttpClient) {}
  public create(
    _tokens: Tokens,
    _http: HttpClient | FakeHttpClient = this.httpClient,
    _baseUrl = environment.apiUrl
  ): TokenPrices {
    return new TokenPrices(_tokens, _http, _baseUrl);
  }
}
