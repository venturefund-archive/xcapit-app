import { isHexString, toUtf8String } from 'ethers/lib/utils';

export class HexString {
  constructor(private readonly _aString: string) {}

  toUtf8(): string {
    return isHexString(this._aString) ? toUtf8String(this._aString) : this._aString;
  }
}
