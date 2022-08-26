import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';

export class CovalentRepo {
  constructor(private readonly _http: HttpClient | FakeHttpClient) {}

  public transfersOf() {
    return true;
  }
}

fdescribe('CovalentRepo', () => {
  let covalentRepo: CovalentRepo;
  let aToken: jasmine.SpyObj<RawToken>;

  beforeEach(() => {
    covalentRepo = new CovalentRepo(new FakeHttpClient());
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(covalentRepo).toBeTruthy();
  });

  it('transfersOf', () => {
    expect(covalentRepo.transfersOf(aToken)).toBeTruthy();
  });
});
