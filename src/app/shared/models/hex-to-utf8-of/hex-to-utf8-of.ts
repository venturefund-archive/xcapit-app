import { isHexString, toUtf8String } from 'ethers/lib/utils';

export class HexToUtf8Of {
  constructor(private readonly _aString: string) {}

  value(): string {
    return isHexString(this._aString) ? toUtf8String(this._aString) : this._aString;
  }
}
