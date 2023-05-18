import { FakeAppStorage, StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { WalletStorageDataFactory } from './wallet-storage-data-factory';

describe('WalletStorageDataFactory', () => {
  let walletStorageDataFactory: WalletStorageDataFactory;
  const aMode = 'import';
  let storage: StorageService;

  beforeEach(() => {
    storage = new FakeAppStorage();
    walletStorageDataFactory = new WalletStorageDataFactory(storage);
  });

  it('new', () => {
    expect(walletStorageDataFactory).toBeTruthy();
  });
  it('oneBy', () => {
    expect(walletStorageDataFactory.oneBy(aMode)).toBeTruthy();
  });
});
