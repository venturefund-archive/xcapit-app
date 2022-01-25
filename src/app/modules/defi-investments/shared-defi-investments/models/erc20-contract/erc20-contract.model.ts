import { Contract, Signer, VoidSigner } from 'ethers';
import { ERC20Provider } from '../erc20-provider/erc20-provider.model';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export class ERC20Contract {
  private readonly _signer: Signer;
  private readonly _provider: ERC20Provider;

  constructor(aProvider: ERC20Provider, aSigner: Signer) {
    this._provider = aProvider;
    this._signer = aSigner;
  }

  static create(aProvider: ERC20Provider) {
    return new this(aProvider, new VoidSigner(ZERO_ADDRESS));
  }

  private signer() {
    return this._signer.connect(this._provider.value());
  }

  value(): Contract {
    return new Contract(this._provider.coin().contract, this._provider.coin().abi, this.signer());
  }
}
