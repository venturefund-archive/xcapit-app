import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { InvestmentMovement } from 'src/app/modules/wallets/shared-wallets/interfaces/investment-movement.interface';
import { RawAmount } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
// TODO: Probar de hacer el cálculo de acá en vez de hacer las querys
export class YieldCalculator {
  private _aYield: BigNumber;

  constructor(
    private readonly _aTotalBalance: number,
    private readonly _movements: InvestmentMovement[],
    private readonly _aTokenName: string,
    private readonly _aTokenUSDPrice: number,
    private readonly _aNumberOfDecimals: number = 18
  ) {  }

  private calculateCumulativeYield(): void {
    this._aYield = parseUnits(this._aTotalBalance.toFixed(this._aNumberOfDecimals), this._aNumberOfDecimals);

    this._movements.forEach((movement) => {
      const amount = BigNumber.from(movement.amount);

      switch (movement.type) {
        case 'deposit':
          this._aYield = this._aYield.sub(amount);
          break;
        case 'withdraw':
          this._aYield = this._aYield.add(amount);
          break;
      }
    });

    if (this._aYield.isNegative()) {
      this._aYield = BigNumber.from('0');
    }
  }

  cumulativeYield(): RawAmount {
    if (!this._aYield) {
      this.calculateCumulativeYield();
    }

    return {
      value: parseFloat(formatUnits(this._aYield, this._aNumberOfDecimals)),
      token: this._aTokenName
    }
  }

  cumulativeYieldUSD(): RawAmount {
    return {
      value: this.cumulativeYield().value * this._aTokenUSDPrice,
      token: 'USD'
    };
  }
}
