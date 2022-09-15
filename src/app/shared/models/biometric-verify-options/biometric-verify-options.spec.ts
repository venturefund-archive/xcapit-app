import { BiometricVerifyOptions } from './biometric-verify-options';

describe('BiometricVerifyOptions', () => {
  let biometricVerifyOptions: BiometricVerifyOptions;

  beforeEach(() => {
    biometricVerifyOptions = new BiometricVerifyOptions();
  });

  it('new', () => {
    expect(biometricVerifyOptions).toBeTruthy();
  });

  it('value', () => {
    expect(biometricVerifyOptions.value()).toEqual({});
  });
});
