import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/abstract-provider';

export class ERC20Token {
  constructor(private readonly _aContract: ERC20Contract) {}

  approve(spender: string, wei: BigNumber): Promise<TransactionResponse | string> {
    return this._aContract.value().approve(spender, wei);
  }

  approveFee(spender: string, wei: BigNumber): Promise<BigNumber> {
    return this._aContract.value().estimateGas.approve(spender, wei);
  }
}
