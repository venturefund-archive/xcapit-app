import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

export class TokenDetail {
  constructor(private readonly _balance: any, private readonly _price: number) {}
  public value(): any {
    return {
      quoteSymbol: 'USD',
      amount: parseFloat(formatUnits(BigNumber.from(this._balance.balance), this._balance.coin.decimals)),
      coin: this._balance.coin,
      price: this._price,
    };
  }
}
