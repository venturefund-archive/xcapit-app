import { BiometricOptions } from 'capacitor-native-biometric/dist/esm/definitions';

export class BiometricVerifyOptions {
  private readonly _defaultOptions = {};
  constructor(private readonly _options: BiometricOptions = undefined) {}

  public value(): BiometricOptions {
    return this._options ?? this._defaultOptions;
  }
}
