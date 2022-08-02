import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { IonicStorageService } from '../../../../../shared/services/ionic-storage/ionic-storage.service';
import { LoginToken } from './login-token';

describe('LoginToken', () => {

  let loginToken: LoginToken;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  const storageKey = 'aStorageKey';
  const aPassword = new Password('aPassword');
  const aHashedPassword = 'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA==';

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(aHashedPassword),
      set: Promise.resolve(),
    });
    loginToken = new LoginToken(aPassword, storageSpy, storageKey);
  });

  it('new', () => {
    expect(loginToken).toBeTruthy();
  });

  it('validate', async () => {
    expect(await loginToken.valid()).toBeTrue();
  });

  it('not valid', async () => {
    storageSpy.get.and.returnValue(Promise.resolve('invalidHash'));
    expect(await loginToken.valid()).toBeFalse();
  });

  it('empty password', async () => {
    loginToken = new LoginToken(new Password(''), storageSpy);

    await expectAsync(loginToken.valid()).toBeRejected();
  });

  it('save', async () => {
    await loginToken.save();

    expect(storageSpy.set).toHaveBeenCalledOnceWith(storageKey, aHashedPassword);
  });
});
