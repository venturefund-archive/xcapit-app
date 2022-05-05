import { Contract, ContractInterface, Signer, VoidSigner, constants } from 'ethers';
import TwoPiMainnetABI from '../../abi/two-pi/two-pi-mainnet.json';
import TwoPiTestnetABI from '../../abi/two-pi/two-pi-testnet.json';
import { environment } from '../../../../../../environments/environment';
import { Environment } from '../../../../../shared/types/environment.type';
import { DefaultERC20Provider } from '../erc20-provider/erc20-provider.model';

export class TwoPiContract {
  constructor(
    private readonly _aContractAddress: string,
    private readonly _aProvider: DefaultERC20Provider,
    private readonly _aSigner: Signer,
    private readonly _anEnvironment: Environment = environment.environment
  ) {}

  static create(_aContractAddress: string, _aProvider: DefaultERC20Provider) {
    return new this(_aContractAddress, _aProvider, new VoidSigner(constants.AddressZero));
  }

  private abi(): ContractInterface {
    return this._anEnvironment === 'PRODUCCION' ? TwoPiMainnetABI : TwoPiTestnetABI;
  }

  private signer(): Signer {
    return this._aSigner.connect(this._aProvider.value());
  }

  value(): Contract {
    return new Contract(this._aContractAddress, this.abi(), this.signer());
  }
}
