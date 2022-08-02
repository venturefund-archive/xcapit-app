import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

export class WeiOf {
  constructor(private readonly _anAmount: number, private readonly _aToken: Coin) {}

  value(): BigNumber {
    return parseUnits(parseFloat(this._anAmount.toString()).toFixed(this._aToken.decimals), this._aToken.decimals);
  }
}
