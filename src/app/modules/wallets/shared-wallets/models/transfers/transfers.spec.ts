import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { FakeCovalentRepo } from '../covalent-repo/fake/fake-covalent-repo';
import { rawTransfers } from '../../fixtures/covalent-transfers.fixture';
import { of } from 'rxjs';
import { Transfers } from './transfers';
import { CacheService } from 'src/app/shared/services/cache/cache.service';

describe('Transfers', () => {
  const rawTransfer = [{
    block_height: 31071581,
    block_signed_at: '2023-01-17T16:50:57Z',
    fees_paid: '30800000301000',
    from_address: '0x925f1b4d8092bd94608b1f680b87f87f0bd737dc',
    from_address_label: null,
    gas_offered: 21000,
    gas_price: 1466666681,
    gas_quote: null,
    gas_quote_rate: null,
    gas_spent: 21000,
    successful: true,
    to_address: '0xa895d3221076a464b45d1cdb30cdc2691497e0c4',
    to_address_label: null,
    tx_hash: '0x0e1029197d9874a36011a11bae091714dcedf7464475906ffa2e54a39411f8a2',
    tx_offset: 8,
    value: '200000000000000',
    value_quote: null,
  }];

  let aToken: jasmine.SpyObj<RawToken>;
  const inAddress = '';
  let transfers: Transfers;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>;
  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
    cacheServiceSpy = jasmine.createSpyObj('CacheService', {
      update: Promise.resolve(rawTransfer),
      get: Promise.resolve(rawTransfer),
    });
    transfers = new Transfers(aToken, inAddress, new FakeCovalentRepo(of(rawTransfers)), cacheServiceSpy);
  });

  it('new', () => {
    expect(transfers).toBeTruthy();
  });

  it('all when native', async () => {
    expect((await transfers.all()).length).toEqual(2);
  });

  it('all when no native', async () => {
    expect((await transfers.all()).length).toEqual(2);
  });

  it('cached', async () => {
    expect((await transfers.cached()).length).toEqual(1);
  });
});
