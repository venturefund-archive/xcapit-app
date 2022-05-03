import { Fee } from '../../interfaces/fee.interface';
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';
import { FakeProvider } from '../../../../../shared/models/provider/fake-provider.spec';

export class NativeFeeOf implements Fee {
  constructor(private readonly _aFee: Fee, private readonly _aProvider: Provider | FakeProvider) {}

  async value(): Promise<BigNumber> {
    return (await this._aFee.value()).mul(await this._aProvider.getGasPrice());
  }
}
