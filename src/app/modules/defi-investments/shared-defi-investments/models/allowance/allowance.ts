import { BigNumber } from 'ethers';

export class Allowance {
  constructor(private readonly anAllowanceValue: BigNumber) {}

  public enoughFor(aWei: BigNumber) {
    return aWei.lte(this.anAllowanceValue);
  }
}

