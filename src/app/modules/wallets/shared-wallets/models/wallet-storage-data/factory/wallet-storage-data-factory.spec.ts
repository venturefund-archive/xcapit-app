import { FakeAppStorage, StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletStorageDataFactory } from './wallet-storage-data-factory';
import { ApiProfilesService } from 'src/app/modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';

describe('WalletStorageDataFactory', () => {
  let walletStorageDataFactory: WalletStorageDataFactory;
  const aMode = 'import';
  let storage: StorageService;
  let profileService: ApiProfilesService;

  beforeEach(() => {
    storage = new FakeAppStorage();
    walletStorageDataFactory = new WalletStorageDataFactory(storage, profileService);
  });

  it('new', () => {
    expect(walletStorageDataFactory).toBeTruthy();
  });
  it('oneBy', () => {
    expect(walletStorageDataFactory.oneBy(aMode)).toBeTruthy();
  });
});
