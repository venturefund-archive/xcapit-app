import { CovalentRepo } from '../covalent-repo.interface';
import { RawToken } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { of } from 'rxjs';
import { FakeCovalentRepo } from './fake-covalent-repo';

fdescribe('FakeCovalentRepo', () => {
  let aToken: jasmine.SpyObj<RawToken>;
  let fakeCovalentRepo: CovalentRepo;
  const inAddress = '';

  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
    fakeCovalentRepo = new FakeCovalentRepo(of({}));
  });

  it('new', () => {
    expect(fakeCovalentRepo).toBeTruthy();
  });

  it('transfersOf', async () => {
    expect(await fakeCovalentRepo.transfersOf(aToken, inAddress).toPromise()).toEqual({});
  });
});
