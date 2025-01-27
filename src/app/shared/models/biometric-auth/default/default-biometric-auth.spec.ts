import { IonicStorageService } from '../../../services/ionic-storage/ionic-storage.service';
import { DefaultBiometricAuth } from './default-biometric-auth';
import { FakeNativeBiometricPlugin } from '../../native-biometric-plugin/fake-native-biometric-plugin';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { BiometricVerifyOptions } from '../../biometric-verify-options/biometric-verify-options';
import { TranslateService } from '@ngx-translate/core';

describe('BiometricAuth', () => {
  let biometricAuth: DefaultBiometricAuth;
  let fakeNativeBiometricPlugin: FakeNativeBiometricPlugin;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  const aPassword = new Password('aPassword');
  const aHashedPassword = 'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA==';

  beforeEach(() => {
    fakeNativeBiometricPlugin = new FakeNativeBiometricPlugin(Promise.resolve(true),Promise.resolve(),Promise.resolve({password: aPassword.value()}));
    translateSpy = jasmine.createSpyObj('TranslateService', { instant: 'test text' }, {});
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      remove: Promise.resolve(),
      get: Promise.resolve(true),
    });
    biometricAuth = new DefaultBiometricAuth(storageSpy, new BiometricVerifyOptions(translateSpy), fakeNativeBiometricPlugin);
  });

  it('new', () => {
    expect(biometricAuth).toBeTruthy();
  });

  it('on need pass subscribe', () => {
    biometricAuth.onNeedPass().subscribe(() => aPassword);
    expect(true).toBeTrue();
  });

  it('on', async () => {
    storageSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve(aHashedPassword));
    biometricAuth.onNeedPass().subscribe(() => aPassword);
    expect(await biometricAuth.on()).toEqual(undefined);
    expect(storageSpy.set).toHaveBeenCalledOnceWith('biometricAuth', true);
  });

  it('on when invalid password', async () => {
    storageSpy.get.withArgs('loginToken').and.returnValue(Promise.resolve('breaking hash'));
    biometricAuth.onNeedPass().subscribe(() => aPassword);
    await expectAsync(biometricAuth.on()).toBeRejected();
    expect(storageSpy.set).not.toHaveBeenCalled();
  });

  it('off', async () => {
    expect(await biometricAuth.off()).toEqual(undefined);
    expect(storageSpy.remove).toHaveBeenCalledOnceWith('biometricAuth');
  });

  it('password', async () => {
    expect(await biometricAuth.password()).toEqual(aPassword.value());
  });

  it('enabled', async () => {
    expect(await biometricAuth.enabled()).toEqual(true);
    expect(storageSpy.get).toHaveBeenCalledOnceWith('biometricAuth');
  });

  it('not enabled', async () => {
    storageSpy.get.and.returnValue(Promise.resolve(null));
    expect(await biometricAuth.enabled()).toEqual(false);
    expect(storageSpy.get).toHaveBeenCalledOnceWith('biometricAuth');
  });

  it('verified', async () => {
    expect(await biometricAuth.verified()).toEqual({verified: true});
  });

  it('available', async () => {
    expect(await biometricAuth.available()).toBeTrue();
  });
});
