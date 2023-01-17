import { BiometricOptions } from 'capacitor-native-biometric/dist/esm/definitions';
import { TranslateService } from '@ngx-translate/core';

export class BiometricVerifyOptions {
  private _defaultOptions: BiometricOptions = {
    reason: this.translate.instant('profiles.biometric_auth.options.title'),
    title: this.translate.instant('profiles.biometric_auth.options.title'),
    subtitle: this.translate.instant('profiles.biometric_auth.options.subtitle'),
    negativeButtonText: this.translate.instant('profiles.biometric_auth.options.negative_button_text'),
    maxAttempts: 3,
  };

  constructor(private readonly translate: TranslateService, private readonly _options?: BiometricOptions) {}

  public value(): BiometricOptions {
    return this._options ?? this._defaultOptions;
  }
}
