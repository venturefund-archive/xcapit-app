import { Injectable } from '@angular/core';
import { ERC20Contract } from '../erc20-contract.model';
import { Signer } from 'ethers';
import { ERC20Provider } from '../../erc20-provider/erc20-provider.interface';

@Injectable({ providedIn: 'root' })
export class ERC20ContractController {
  public new(_aProvider: ERC20Provider, _aSigner?: Signer): ERC20Contract {
    return _aSigner ? new ERC20Contract(_aProvider, _aSigner) : ERC20Contract.create(_aProvider);
  }
}
