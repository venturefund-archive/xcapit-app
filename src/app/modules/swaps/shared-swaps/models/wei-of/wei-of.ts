import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { Token } from "../token/token";


export class WeiOf {

  constructor(private anAmount: number|string, private _aToken: Token) { }

  value(): BigNumber {
    return parseUnits(`${this.anAmount}`, this._aToken.decimals());
  }
}
