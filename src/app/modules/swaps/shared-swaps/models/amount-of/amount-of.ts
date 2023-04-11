import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { Token } from '../token/token';

export type RawAmount = {
  value: number;
  token: string;
};

export class AmountOf {
  constructor(private _aWeiAmount: string, private _aToken: Token) {}

  value(): number {
    return parseFloat(formatUnits(this._aWeiAmount, this._aToken.decimals()));
  }

  weiValue(): string {
    return this._aWeiAmount;
  }

  times(aMultiplier: BigNumberish): AmountOf {
    return new AmountOf(BigNumber.from(this._aWeiAmount).mul(aMultiplier).toString(), this._aToken);
  }

  json(): RawAmount {
    return {
      value: this.value(),
      token: this._aToken.symbol(),
    };
  }
}

export class NullAmountOf {
  json(): RawAmount {
    return { value: undefined, token: undefined };
  }
}
