import { DefaultBiometricAuth } from '../default/default-biometric-auth';
import { BiometricAuthInjectable } from './biometric-auth-injectable';

describe('BiometricAuthInjectable', () => {
  it('new', () => {
    expect(new BiometricAuthInjectable(null)).toBeTruthy();
  });

  it('create', () => {
    expect(new BiometricAuthInjectable(null).create()).toBeInstanceOf(DefaultBiometricAuth);
  });
});
