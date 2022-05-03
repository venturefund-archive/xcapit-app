import { BigNumber, constants, Signer, VoidSigner } from 'ethers';
import { DefaultERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { Coin } from '../../interfaces/coin.interface';

export class NativeToken {
  constructor(private readonly _aProvider: DefaultERC20Provider, private readonly _aSigner: Signer) {}

  static create(_aProvider: DefaultERC20Provider): NativeToken {
    return new this(_aProvider, new VoidSigner(constants.AddressZero));
  }

  private signer(): Signer {
    return this._aSigner.connect(this._aProvider.value());
  }

  transfer(to: string, value: BigNumber, args: any): Promise<TransactionResponse> {
    return this.signer().sendTransaction({ to, value, ...args });
  }

  transferFee(to: string, value: BigNumber): Promise<BigNumber> {
    return this.signer().estimateGas({ to, value });
  }

  getGasPrice(): Promise<BigNumber> {
    return this.signer().getGasPrice();
  }

  coin(): Coin {
    return this._aProvider.coin();
  }
}
