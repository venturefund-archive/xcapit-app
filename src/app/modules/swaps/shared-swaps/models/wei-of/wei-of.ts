import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { Token } from "../token/token";


export class WeiOf {

  constructor(private _anAmount: number|string, private _aToken: Token) { }

  value(): BigNumber {
    return parseUnits(
      parseFloat(`${this._anAmount}`).toFixed(this._aToken.decimals()),
      this._aToken.decimals()
    );
  }
}
