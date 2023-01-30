import { HttpClient } from '@angular/common/http';
import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { CovalentQuoteCurrency } from '../../../types/covalent-quote-currencies.type';
import { Observable } from 'rxjs';
import { CovalentRepo } from '../covalent-repo.interface';

export type CovalentAuthHeaders = {
  Authorization: string;
};

export class DefaultCovalentRepo implements CovalentRepo {
  constructor(private readonly _http: HttpClient | FakeHttpClient, private readonly _env: EnvService) {}

  public transfersOf(aToken: RawToken, inAddress: string): Observable<any> {
    return this._http.get(this._url(aToken, inAddress), { headers: this._authHeaders() });
  }

  private _authHeaders(): CovalentAuthHeaders {
    return { Authorization: `Basic ${btoa(this._env.byKey('covalentApiKey') + ':')}` };
  }

  private _url(aToken: RawToken, address: string, quoteCurrency: CovalentQuoteCurrency = 'USD'): string {
    return aToken.native
      ? `${this._env.byKey('covalentApiUrl')}${
          aToken.chainId
        }/address/${address}/transactions_v2/?no-logs=true&match={"value":{"$ne": "0"}}&limit=100&quote-currency=${quoteCurrency}`
      : `${this._env.byKey('covalentApiUrl')}${aToken.chainId}/address/${address}/transfers_v2/?contract-address=${
          aToken.contract
        }&limit=10&quote-currency=${quoteCurrency}`;
  }

  transferByHash(chainId: number,hash:string ){
    return this._http.get(`${this._env.byKey('covalentApiUrl')}${chainId}/transaction_v2/${hash}/`, { headers: this._authHeaders() })
  }
}
