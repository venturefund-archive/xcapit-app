import { HttpClient } from '@angular/common/http';
import { async } from '@firebase/util';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';


export class CovalentRepo {
  constructor(private readonly _http: HttpClient | FakeHttpClient) {}

  public transfersOf(aToken: RawToken, inAddress: string) {
    return this._http.get('');
    // return this.http
    //   .get(this.getUrl(asset, address, quoteCurrency), { headers: this.authHeaders })
    //   .pipe(map((res) => new CovalentTransfersResponse(res, asset)));
  }
}

fdescribe('CovalentRepo', () => {
  let covalentRepo: CovalentRepo;
  let aToken: jasmine.SpyObj<RawToken>;
  const inAddress = '';

  beforeEach(() => {
    covalentRepo = new CovalentRepo(new FakeHttpClient(true));
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(covalentRepo).toBeTruthy();
  });

  it('transfersOf', async() => {
    const response = await covalentRepo.transfersOf(aToken, inAddress).toPromise();
    expect(covalentRepo.transfersOf(aToken, inAddress)).toBeTruthy();
  });
});
