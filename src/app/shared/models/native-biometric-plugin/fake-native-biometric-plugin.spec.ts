import { FakeNativeBiometricPlugin } from './fake-native-biometric-plugin';

describe('FakeNativeBiometricPlugin', () => {
  let fakeNativeBiometricPlugin: FakeNativeBiometricPlugin;

  beforeEach(() => {
    fakeNativeBiometricPlugin = new FakeNativeBiometricPlugin();
  });

  it('new', () => {
    expect(fakeNativeBiometricPlugin).toBeTruthy();
  });

  it('verify', async () => {
    expect(await fakeNativeBiometricPlugin.verifyIdentity()).toEqual(true);
  });

  it('setCredentials', async () => {
    expect(await fakeNativeBiometricPlugin.setCredentials({})).toEqual(undefined);
  });

  it('getCredentials', async () => {
    expect(await fakeNativeBiometricPlugin.getCredentials({})).toEqual({});
  });

  it('deleteCredentials', async () => {
    expect(await fakeNativeBiometricPlugin.deleteCredentials({})).toEqual(undefined);
  });

  it('isAvailable', async () => {
    expect(await fakeNativeBiometricPlugin.isAvailable()).toEqual({ isAvailable: true });
  });
});
