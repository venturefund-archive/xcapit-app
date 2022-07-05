import { formatUnits } from "ethers/lib/utils";
import { Token } from "../token/token";


export class AmountOf {

  constructor(private _aWeiAmount: string, private _fromToken: Token) { }

  value(): number {
    return parseFloat(formatUnits(this._aWeiAmount, this._fromToken.decimals()));
  }
}
