import { HttpClient } from '@angular/common/http';
import { async } from '@firebase/util';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentQuoteCurrency } from '../../types/covalent-quote-currencies.type';
import { environment } from '../../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { CovalentTransfersResponse } from '../covalent-transfers-response/covalent-transfers-response';
import { Coin } from '../../interfaces/coin.interface';

export class CovalentRepo {
  constructor(private readonly _http: HttpClient | FakeHttpClient, private readonly _env: EnvService) {}

  public transfersOf(aToken: RawToken, inAddress: string) {
    return this._http
      .get(this._url(aToken, inAddress), { headers: this._authHeaders() })
      .pipe(map((res) => new CovalentTransfersResponse(res, aToken as Coin)));
  }

  private _authHeaders() {
    return { Authorization: `Basic ${btoa(this._env.byKey('covalentApiKey') + ':')}` };
  }

  private _url(aToken: RawToken, address: string, quoteCurrency: CovalentQuoteCurrency = 'USD'): string {
    return aToken.native
      ? `${this._env.byKey('covalentApiUrl')}${
          aToken.chainId
        }/address/${address}/transactions_v2/?no-logs=true&match={"value":{"$ne": "0"}}&limit=10&quote-currency=${quoteCurrency}`
      : `${this._env.byKey('covalentApiUrl')}${aToken.chainId}/address/${address}/transfers_v2/?contract-address=${
          aToken.contract
        }&limit=10&quote-currency=${quoteCurrency}`;
  }
}

fdescribe('CovalentRepo', () => {
  let covalentRepo: CovalentRepo;
  let aToken: jasmine.SpyObj<RawToken>;
  let envSpy: jasmine.SpyObj<EnvService>;
  const inAddress = '';

  beforeEach(() => {
    envSpy = jasmine.createSpyObj('EnvService', { byKey: 'http://covalentUrl/' });
    covalentRepo = new CovalentRepo(new FakeHttpClient(true), envSpy);
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(covalentRepo).toBeTruthy();
  });

  it('transfersOf', async () => {
    const response = await covalentRepo.transfersOf(aToken, inAddress).toPromise();
    expect(response).toBeTruthy();
  });
});
