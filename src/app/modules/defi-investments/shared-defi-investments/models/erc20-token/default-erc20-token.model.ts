import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ERC20Token } from './erc20-token.interface';

export class DefaultERC20Token implements ERC20Token {
  constructor(private readonly _aContract: ERC20Contract) {}

  allowance(owner: string, spender: string): Promise<BigNumber> {
    return this._aContract.value().allowance(owner, spender);
  }

  approve(spender: string, wei: BigNumber, gasPrice: BigNumber): Promise<TransactionResponse> {
    return this._aContract.value().approve(spender, wei, { gasPrice });
  }

  approveFee(spender: string, wei: BigNumber): Promise<BigNumber> {
    return this._aContract.value().estimateGas.approve(spender, wei);
  }

  transfer(to: string, value: BigNumber, args: any): Promise<TransactionResponse> {
    return this._aContract.value().transfer(to, value, args);
  }

  transferFee(to: string, value: BigNumber): Promise<BigNumber> {
    return this._aContract.value().estimateGas.transfer(to, value);
  }

  getGasPrice(): Promise<BigNumber> {
    return this._aContract.getGasPrice();
  }

  balanceOf(address: string): Promise<BigNumber> {
    return this._aContract.value().balanceOf(address);
  }
}
