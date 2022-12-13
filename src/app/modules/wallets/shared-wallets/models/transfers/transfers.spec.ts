import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { FakeCovalentRepo } from '../covalent-repo/fake/fake-covalent-repo';
import { rawTransfers } from '../../fixtures/covalent-transfers.fixture';
import { of } from 'rxjs';
import { Transfers } from './transfers';
import { rawNoNativeTransfers } from '../../fixtures/covalent-no-native-transfers.fixture';

describe('Transfers', () => {
  let aToken: jasmine.SpyObj<RawToken>;
  const inAddress = '';
  let transfers: Transfers;
  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
    transfers = new Transfers(aToken, inAddress, new FakeCovalentRepo(of(rawTransfers)));
  });

  it('new', () => {
    expect(transfers).toBeTruthy();
  });

  it('all when native', async () => {
    expect((await transfers.all()).length).toEqual(2);
  });

  it('all when no native', async () => {
    transfers = new Transfers(aToken, inAddress, new FakeCovalentRepo(of(rawNoNativeTransfers)));
    expect((await transfers.all()).length).toEqual(1);
  });
});