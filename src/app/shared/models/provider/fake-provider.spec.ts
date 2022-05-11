import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

export class FakeProvider {
  constructor(private readonly _gasPrice: any = {}, private readonly _balance: any = '0') {}

  getGasPrice(): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(this._gasPrice));
  }

  estimateGas(): Promise<BigNumber> {
    return Promise.resolve(BigNumber.from(this._gasPrice));
  }

  getBalance(): Promise<BigNumber> {
    return Promise.resolve(parseEther(this._balance));
  }
}
