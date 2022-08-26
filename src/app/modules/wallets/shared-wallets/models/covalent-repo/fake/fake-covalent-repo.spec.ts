import { CovalentRepo } from '../covalent-repo.interface';
import { RawToken } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentTransfersResponse } from '../../covalent-transfers-response/covalent-transfers-response';
import { of } from 'rxjs';
import { FakeCovalentRepo } from './fake-covalent-repo';

fdescribe('FakeCovalentRepo', () => {
  let aToken: jasmine.SpyObj<RawToken>;
  let covalentTransfersResponseSpy: jasmine.SpyObj<CovalentTransfersResponse>;
  let fakeCovalentRepo: CovalentRepo;
  const inAddress = '';

  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
    covalentTransfersResponseSpy = jasmine.createSpyObj('CovalentTransfersResponse', { value: null });
    fakeCovalentRepo = new FakeCovalentRepo(of(covalentTransfersResponseSpy));
  });

  it('new', () => {
    expect(fakeCovalentRepo).toBeTruthy();
  });

  it('transfersOf', async () => {
    expect(await fakeCovalentRepo.transfersOf(aToken, inAddress).toPromise()).toBeTruthy();
  });
});
