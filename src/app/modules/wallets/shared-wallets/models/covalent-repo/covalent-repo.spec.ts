import { HttpClient } from '@angular/common/http';
import { async } from '@firebase/util';
import { EnvService } from 'src/app/shared/services/env/env.service';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentQuoteCurrency } from '../../types/covalent-quote-currencies.type';


export class CovalentRepo {
  constructor(private readonly _http: HttpClient | FakeHttpClient) {}

  public transfersOf(aToken: RawToken, inAddress: string) {
    return this._http
        .get('')
    // return this.http
    //   .get(this.getUrl(asset, address, quoteCurrency), { headers: this.authHeaders })
    //   .pipe(map((res) => new CovalentTransfersResponse(res, asset)));
  }

 /*  private _url(aToken: RawToken, address: string, quoteCurrency: CovalentQuoteCurrency = 'USD'): string {
    return aToken.native
      ? `${environment.covalentApiUrl}${aToken.chainId}/address/${address}/transactions_v2/?no-logs=true&match={"value":{"$ne": "0"}}&limit=10&quote-currency=${quoteCurrency}`
      : `${environment.covalentApiUrl}${aToken.chainId}/address/${address}/transfers_v2/?contract-address=${aToken.contract}&limit=10&quote-currency=${quoteCurrency}`;
  } */
}

fdescribe('CovalentRepo', () => {
  let covalentRepo: CovalentRepo;
  let aToken: jasmine.SpyObj<RawToken>;
  let envSpy: jasmine.SpyObj<EnvService>
  const inAddress = '';

  beforeEach(() => {
    envSpy = jasmine.createSpyObj('EnvService', {byKey: 'http://covalentUrl/'})
    covalentRepo = new CovalentRepo(new FakeHttpClient(true), envSpy);
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(covalentRepo).toBeTruthy();
  });

  it('transfersOf', async() => {
    const response = await covalentRepo.transfersOf(aToken, inAddress).toPromise();
    expect(response).toBeTrue();
  });
});
