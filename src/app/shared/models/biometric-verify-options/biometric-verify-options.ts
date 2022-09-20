import { BiometricOptions } from 'capacitor-native-biometric/dist/esm/definitions';
import { TranslateService } from '@ngx-translate/core';
export class BiometricVerifyOptions {
  constructor(private readonly _options: BiometricOptions) {}
  public value(): BiometricOptions {
    return this._options;
  }
}
