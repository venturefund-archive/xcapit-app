import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/abstract-provider';
export class ERC20Token {
  constructor(private readonly _aContract: ERC20Contract) {}

  approve(spender: string, wei: BigNumber, gasPrice: BigNumber): Promise<TransactionResponse> {
    return this._aContract.value().approve(spender, wei, { gasPrice });
  }

  approveFee(spender: string, wei: BigNumber): Promise<BigNumber> {
    return this._aContract.value().estimateGas.approve(spender, wei);
  }

  transfer(to: string, value: BigNumber): Promise<TransactionResponse> {
    return this._aContract.value().transfer(to, value);
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
