import { Injectable } from '@angular/core';
import { DefaultERC20Token } from '../default-erc20-token.model';
import { ERC20Token } from '../erc20-token.interface';
import { ERC20Contract } from '../../erc20-contract/erc20-contract.model';

@Injectable({ providedIn: 'root' })
export class ERC20TokenController {
  public new(_contract: ERC20Contract): ERC20Token {
    return new DefaultERC20Token(_contract);
  }
}
