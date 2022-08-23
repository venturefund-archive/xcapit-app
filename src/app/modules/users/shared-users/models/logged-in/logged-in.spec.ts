import { IonicStorageService } from '../../../../../shared/services/ionic-storage/ionic-storage.service';
import { LoggedIn } from './logged-in';

describe('LoggedIn', () => {
  let loggedIn: LoggedIn;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  const aTestValue = true;
  const storageKey = 'aStorageKey';
  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(aTestValue),
      set: Promise.resolve(),
    });
    loggedIn = new LoggedIn(storageSpy, storageKey);
  });

  it('new', () => {
    expect(loggedIn).toBeTruthy();
  });

  it('save', async () => {
    await loggedIn.save(aTestValue);
    expect(storageSpy.set).toHaveBeenCalledOnceWith(storageKey, aTestValue);
  });

  it('value', async () => {
    expect(await loggedIn.value()).toBeTrue();
  });
});
