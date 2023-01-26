import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { FakeCovalentRepo } from '../covalent-repo/fake/fake-covalent-repo';
import { rawTransfers } from '../../fixtures/covalent-transfers.fixture';
import { of } from 'rxjs';
import { Transfers } from './transfers';
import { rawNoNativeTransfers } from '../../fixtures/covalent-no-native-transfers.fixture';
import { CacheService } from 'src/app/shared/services/cache/cache.service';

describe('Transfers', () => {
  let aToken: jasmine.SpyObj<RawToken>;
  const inAddress = '';
  let transfers: Transfers;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>
  beforeEach(() => {
    cacheServiceSpy = jasmine.createSpyObj('CacheService', {
      update: Promise.resolve(),
      get: Promise.resolve(),
    });
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
    transfers = new Transfers(aToken, inAddress, new FakeCovalentRepo(of(rawTransfers)), cacheServiceSpy);
  });

  it('new', () => {
    expect(transfers).toBeTruthy();
  });

  it('all when native', async () => {
    expect((await transfers.all()).length).toEqual(2);
  });

  it('all when no native', async () => {
    transfers = new Transfers(aToken, inAddress, new FakeCovalentRepo(of(rawNoNativeTransfers)), cacheServiceSpy);
    expect((await transfers.all()).length).toEqual(1);
  });
});
