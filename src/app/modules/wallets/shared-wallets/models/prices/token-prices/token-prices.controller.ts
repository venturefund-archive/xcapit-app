import { Injectable } from '@angular/core';
import { Coin } from '../../../interfaces/coin.interface';
import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { environment } from '../../../../../../../environments/environment';
import { TokenPrices } from './token-prices';

@Injectable({ providedIn: 'root' })
export class TokenPricesController {
  public new(_coins: Coin[], _http: HttpClient | FakeHttpClient, _baseUrl = environment.apiUrl): TokenPrices {
    return new TokenPrices(_coins, _http, _baseUrl);
  }
}
