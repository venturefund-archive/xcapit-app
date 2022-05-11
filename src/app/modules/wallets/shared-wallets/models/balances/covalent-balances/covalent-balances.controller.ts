import { Injectable } from '@angular/core';
import { CovalentBalances } from './covalent-balances';
import { Coin } from '../../../interfaces/coin.interface';
import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { environment } from '../../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CovalentBalancesController {
  public new(
    _address: string,
    _coins: Coin[],
    _http: HttpClient | FakeHttpClient,
    _baseUrl = environment.covalentApiUrl
  ): CovalentBalances {
    return new CovalentBalances(_address, _coins, _http, _baseUrl);
  }
}
