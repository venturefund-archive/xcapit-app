import { FakeBiometricAuth } from './fake-biometric-auth';
import { BiometricAuth } from '../biometric-auth.interface';
import { Password } from '../../../../modules/swaps/shared-swaps/models/password/password';

describe('FakeBiometricAuth', () => {
  let fakeBiometricAuth: BiometricAuth;
  const aPassword = new Password('aPassword');

  beforeEach(() => {
    fakeBiometricAuth = new FakeBiometricAuth();
  });

  it('new', () => {
    expect(fakeBiometricAuth).toBeTruthy();
  });

  it('available', async () => {
    expect(await fakeBiometricAuth.available()).toBeTrue();
  });

  it('enabled', async () => {
    expect(await fakeBiometricAuth.enabled()).toBeTrue();
  });

  it('off', async () => {
    expect(await fakeBiometricAuth.off()).toBeUndefined();
  });

  it('on', async () => {
    expect(await fakeBiometricAuth.on()).toBeUndefined();
  });

  it('on with error', async () => {
    fakeBiometricAuth = new FakeBiometricAuth(null, null, null, Promise.reject());
    await expectAsync(fakeBiometricAuth.on()).toBeRejected();
  });

  it('onNeedPass', async () => {
    fakeBiometricAuth.onNeedPass().subscribe(() => aPassword);
    expect(true).toBeTrue();
  });

  it('verified', async () => {
    expect(await fakeBiometricAuth.verified()).toEqual({ verified: false, message: 'Error Message.' });
  });
});
