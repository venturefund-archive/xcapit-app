import { BigNumber, constants, Signer, VoidSigner } from 'ethers';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { TransactionResponse } from '@ethersproject/abstract-provider';

export class NativeToken {
  constructor(private readonly _aProvider: ERC20Provider, private readonly _aSigner: Signer) {}

  static create(_aProvider: ERC20Provider): NativeToken {
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
}
