import * as CryptoJs from 'crypto-js';

export class SerializedArgs {
  constructor(private _args: any[]) {}

  value(): string {
    return this._hashedValue(this._args.map((arg) => this._normalizeArg(arg)).join(':'));
  }

  private _normalizeArg(arg: any): string {
    return (typeof arg == 'object' ? this._stringifiedObject(arg) : arg).toString();
  }

  private _stringifiedObject(arg: any): string {
    return [...Object.entries(arg), ...Reflect.ownKeys(Reflect.getPrototypeOf(arg))].join(':');
  }

  private _hashedValue(value: any): string {
    return CryptoJs.SHA3(value).toString(CryptoJs.enc.Base64);
  }
}
