import { BiometricOptions } from 'capacitor-native-biometric/dist/esm/definitions';

export class BiometricVerifyOptions {
  private _defaultOptions = {
    title: 'hola',
    subtitle: 'como estas'
  }
  constructor(private readonly _options?: BiometricOptions) {}

  public value(): BiometricOptions {
    return this._options??this._defaultOptions;
  }
}
