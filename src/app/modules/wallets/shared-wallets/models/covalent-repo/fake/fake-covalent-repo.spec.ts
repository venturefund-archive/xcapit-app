import { CovalentRepo } from '../covalent-repo.interface';
import { RawToken } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentTransfersResponse } from '../../covalent-transfers-response/covalent-transfers-response';
import { Observable } from 'rxjs';

export class FakeCovalentRepo implements CovalentRepo {
  constructor() {}

  transfersOf(aToken: RawToken, inAddress: string): Observable<CovalentTransfersResponse> {
    return undefined;
  }
}

fdescribe('FakeCovalentRepo', () => {
  let aToken: jasmine.SpyObj<RawToken>;
  const inAddress = '';

  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(new FakeCovalentRepo()).toBeTruthy();
  });

  it('transfersOf', () => {
    expect(new FakeCovalentRepo().transfersOf(aToken, inAddress)).toBeTruthy();
  });
});
