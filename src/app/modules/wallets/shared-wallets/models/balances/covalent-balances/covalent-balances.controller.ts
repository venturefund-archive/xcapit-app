import { Injectable } from '@angular/core';
import { CovalentBalances } from './covalent-balances';
import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { environment } from '../../../../../../../environments/environment';
import { Tokens } from '../../../../../swaps/shared-swaps/models/tokens/tokens';

@Injectable({ providedIn: 'root' })
export class CovalentBalancesController {
  public new(
    _address: string,
    _tokens: Tokens,
    _http: HttpClient | FakeHttpClient,
    _baseUrl = environment.covalentApiUrl
  ): CovalentBalances {
    return new CovalentBalances(_address, _tokens, _http, _baseUrl);
  }
}
