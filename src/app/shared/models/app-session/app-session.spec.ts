import { FakeAppStorage } from '../../services/app-storage/app-storage.service';
import { AppSession } from './app-session';
import { AppExpirationTimeService } from './injectable/app-expiration-time.service';

describe('AppSession', () => {
  let appSession: AppSession;
  let fakeStorage: FakeAppStorage;
  let AppExpirationTimeServiceSpy: jasmine.SpyObj<AppExpirationTimeService>;
  const aDate = 1234;
  const storageKey = '_xcp_app_session_created_time';
  const _sessionExpirationTime = '_xcp_app_session_expiration_time';

  beforeEach(() => {
    fakeStorage = new FakeAppStorage();
    appSession = new AppSession(fakeStorage, 2, null);
    AppExpirationTimeServiceSpy = jasmine.createSpyObj('AppExpirationTimeServiceSpy', {
      get: Promise.resolve(2),
    });
  });

  it('new ', () => {
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
    const result = new AppSession(fakeStorage, null, AppExpirationTimeServiceSpy);

    expect(await result.valid()).toBeTrue();
    expect(AppExpirationTimeServiceSpy.get).toHaveBeenCalledTimes(1);
  });
});
