import { BigNumber } from 'ethers';

export class FakeProvider {
  constructor(private readonly _gasPrice: any = {}) {}

  getGasPrice(): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(this._gasPrice));
  }

  estimateGas(): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(this._gasPrice));
  }
}
