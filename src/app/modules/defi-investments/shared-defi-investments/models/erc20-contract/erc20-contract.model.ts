import { constants, Contract, Signer, VoidSigner } from 'ethers';
import { ERC20Provider } from '../erc20-provider/erc20-provider.model';

export class ERC20Contract {
  constructor(private readonly _aProvider: ERC20Provider, private readonly _aSigner: Signer) {}

  static create(aProvider: ERC20Provider): ERC20Contract {
    return new this(aProvider, new VoidSigner(constants.AddressZero));
  }

  private signer(): Signer {
    return this._aSigner.connect(this._aProvider.value());
  }

  value(): Contract {
    return new Contract(this._aProvider.coin().contract, this._aProvider.coin().abi, this.signer());
  }
}
