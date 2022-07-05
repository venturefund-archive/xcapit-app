import { Token } from "../token/token";
import { WeiOf } from "../wei-of/wei-of";


export class Swap {

  constructor(
    private _anAmount: string|number,
    private _fromToken: Token,
    private _toToken: Token
  ) { }

  fromToken(): Token {
    return this._fromToken;
  }

  toToken(): Token {
    return this._toToken;
  }

  weiAmount(): WeiOf {
    return new WeiOf(this._anAmount, this.fromToken());
  }
}
