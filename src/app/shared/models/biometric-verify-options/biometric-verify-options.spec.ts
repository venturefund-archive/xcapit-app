import { TranslateService } from '@ngx-translate/core';
import { BiometricVerifyOptions } from './biometric-verify-options';

describe('BiometricVerifyOptions', () => {
  let biometricVerifyOptions: BiometricVerifyOptions;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  beforeEach(() => {
    translateSpy = jasmine.createSpyObj('TranslateService', { instant: 'test text' }, {});
    biometricVerifyOptions = new BiometricVerifyOptions(translateSpy);
  });

  it('new', () => {
    expect(biometricVerifyOptions).toBeTruthy();
  });

  it('value', () => {
    expect(biometricVerifyOptions.value()).toEqual({
      reason: 'test text',
      title: 'test text',
      subtitle: 'test text',
      negativeButtonText: 'test text',
      maxAttempts: 3,
    });
  });
});
