import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FakeAppStorage } from '../../services/app-storage/app-storage.service';
import { AppSession } from './app-session';
import { AppExpirationTimeService } from './injectable/app-expiration-time.service';

describe('AppSession', () => {
  let appSession: AppSession;
  let fakeStorage: FakeAppStorage;
  let appExpirationTimeServiceSpy: jasmine.SpyObj<AppExpirationTimeService>;
  let walletStorageSpy: jasmine.SpyObj<StorageService>;
  const aDate = 1234;
  const storageKey = '_xcp_app_session_created_time';
  const _sessionExpirationTime = '_xcp_app_session_expiration_time';

  beforeEach(() => {
    walletStorageSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve({})
    });
    fakeStorage = new FakeAppStorage();
    appExpirationTimeServiceSpy = jasmine.createSpyObj('AppExpirationTimeService', {
      get: Promise.resolve(2),
    });
    appSession = new AppSession(fakeStorage, walletStorageSpy, 2, appExpirationTimeServiceSpy);
  });

  it('new', () => {
    expect(appSession).toBeTruthy();
  });

  it('validate', async () => {
    fakeStorage.set(storageKey, new Date().valueOf());
    expect(await appSession.valid()).toBeTrue();
  });

  it('validate return false', async () => {
    fakeStorage.set(storageKey, aDate);
    expect(await appSession.valid()).toBeFalse();
  });

  it('save', async () => {
    appSession.save();
    expect(await fakeStorage.get(storageKey)).toBeTruthy();
  });

  it('setSessionExpirationTime', async () => {
    appSession.setSessionExpirationTime(3);

    expect(await fakeStorage.get(_sessionExpirationTime)).toEqual(3);
  });

  it('should get session expiration time value from service when no time value is found', async () => {
    fakeStorage.set(storageKey, new Date().valueOf());
    const result = new AppSession(fakeStorage, walletStorageSpy, null, appExpirationTimeServiceSpy);

    expect(await result.valid()).toBeTrue();
    expect(appExpirationTimeServiceSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should not close session if no wallet on storage', async () => {
    fakeStorage.set(storageKey, aDate);
    walletStorageSpy.getWalletFromStorage.and.resolveTo(null);
    expect(await appSession.valid()).toBeTrue();
  });
});
