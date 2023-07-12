import { FakeAppStorage, StorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { DefaultWalletStorageData } from './default-wallet-storage-data';
import { ApiProfilesService } from 'src/app/modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';
import { of } from 'rxjs';

describe('DefaultWalletStorageData', () => {
  const profile = { notifications_enabled: true };
  let defaultWalletStorageData: DefaultWalletStorageData;
  let storage: StorageService;
  let apiProfilesServiceSpy: jasmine.SpyObj<ApiProfilesService>;

  beforeEach(() => {
    storage = new FakeAppStorage();
    apiProfilesServiceSpy = jasmine.createSpyObj('ApiProfilesService', { getUserData: of(profile) });
    defaultWalletStorageData = new DefaultWalletStorageData(storage, apiProfilesServiceSpy);
  });

  it('new', () => {
    expect(defaultWalletStorageData).toBeTruthy();
  });

  it('save', async () => {
    await defaultWalletStorageData.save();
    expect(await storage.get('userAcceptedToS')).toEqual(true);
    expect(await storage.get('tokens_structure_migrated')).toEqual(true);
    expect(await storage.get('enabledPushNotifications')).toEqual(true);
    expect(await storage.get('loggedIn')).toEqual(true);
    expect(apiProfilesServiceSpy.getUserData).toHaveBeenCalledTimes(1);
  });
});