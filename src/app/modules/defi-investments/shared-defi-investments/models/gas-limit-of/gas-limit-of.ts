import { Fee } from '../../interfaces/fee.interface';

export class GasLimitOf {
  constructor(private readonly aFee: Fee, private readonly aPercentage = 50) {}

  private async _fee(): Promise<number> {
    return (await this.aFee.value()).toNumber();
  }

  private _ratio(): number {
    return 1 + this.aPercentage / 100;
  }

  public async value(): Promise<string> {
    return ((await this._fee()) * this._ratio()).toFixed();
  }
}
