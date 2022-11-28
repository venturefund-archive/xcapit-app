import { Token } from "src/app/modules/swaps/shared-swaps/models/token/token";
import { WeiOf } from "src/app/modules/swaps/shared-swaps/models/wei-of/wei-of";


export class SolanaSend {

  constructor(private _anAmount: number | string, private _aToken: Token, private _toAddress: string) {}

  weiAmount(): WeiOf {
    return new WeiOf(this._anAmount, this._aToken);
  }

  token(): Token {
    return this._aToken;
  }

  toAddress(): string {
    return this._toAddress;
  }
}
