import { FakeAppStorage, StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { DefaultWalletStorageData } from './default-wallet-storage-data';

describe('DefaultWalletStorageData', () => {
  let defaultWalletStorageData: DefaultWalletStorageData;
  let storage: StorageService;

  beforeEach(() => {
    storage = new FakeAppStorage();
    defaultWalletStorageData = new DefaultWalletStorageData(storage);
  });

  it('new', () => {
    expect(defaultWalletStorageData).toBeTruthy();
  });

  it('save', async () => {
    await defaultWalletStorageData.save();
    expect(await storage.get('userAcceptedToS')).toEqual(true);
    expect(await storage.get('tokens_structure_migrated')).toEqual(true);
    expect(await storage.get('_enabledPushNotifications')).toEqual(true);
    expect(await storage.get('loggedIn')).toEqual(true);
  });
});
