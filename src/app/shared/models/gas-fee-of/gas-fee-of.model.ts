import { BigNumber, Contract } from 'ethers';
import { FakeContract } from '../../../modules/defi-investments/shared-defi-investments/models/fake-contract/fake-contract.model';
import { Fee } from '../../../modules/defi-investments/shared-defi-investments/interfaces/fee.interface';

export class GasFeeOf implements Fee {
  constructor(
    private readonly _aContract: Contract | FakeContract,
    private readonly _aMethodName: string,
    private readonly _args: any[]
  ) {}

  async value(): Promise<BigNumber> {
    return await this._aContract.estimateGas[this._aMethodName](...this._args);
  }
}
