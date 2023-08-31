import { Contract, ethers } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { WeiOf } from 'src/app/shared/models/wei-of/wei-of';
import { BlockchainTx } from '../blockchain-tx';

export class XscrowDepositTx implements BlockchainTx {
  constructor(private _aWeiAmount: WeiOf, private _aXscrowAddress: string) {}

  value(): Promise<TransactionRequest> {
    return new Contract(this._aXscrowAddress, this._depositInterface()).populateTransaction.deposit(
      this._aWeiAmount.value()
    );
  }

  private _depositInterface(): ethers.utils.Interface {
    return new ethers.utils.Interface(['function deposit(uint256 anAmount)']);
  }
}
