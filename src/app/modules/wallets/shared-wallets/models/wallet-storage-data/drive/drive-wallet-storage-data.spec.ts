import { DriveWalletStorageData } from './drive-wallet-storage-data';
import { FakeWalletStorageData } from '../fake/fake-wallet-storage-data';
import { FakeAppStorage, StorageService } from 'src/app/shared/services/app-storage/app-storage.service';

describe('DriveWalletStorageData', () => {
  let driveWalletStorageData: DriveWalletStorageData;
  let storage: StorageService;

  beforeEach(() => {
    storage = new FakeAppStorage();
    driveWalletStorageData = new DriveWalletStorageData(new FakeWalletStorageData(), storage);
  });

  it('new', () => {
    expect(driveWalletStorageData).toBeTruthy();
  });

  it('save', async () => {
    await driveWalletStorageData.save();
    expect(await storage.get('wallet_backup')).toEqual(true);
  });
});
