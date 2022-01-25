import { Transaction } from 'ethers';
import { ERC20Contract } from '../erc20-contract/erc20-contract.model';

export class ERC20Token {
  private readonly _contract: ERC20Contract;

  constructor(aContract: ERC20Contract) {
    this._contract = aContract;
  }

  approve(spender: string, amount: number): Promise<Transaction | string> {
    return this._contract.value().approve(spender, amount);
  }
}
