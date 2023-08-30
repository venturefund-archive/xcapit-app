import { BigNumber, Contract, ethers } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { BlockchainTx } from '../blockchain-tx';
import { WeiOf } from 'src/app/shared/models/wei-of/wei-of';

export class ApproveTx implements BlockchainTx {
  constructor(private _aContractAddress: string, private _aSpenderAddress: string, private _aWeiValue: WeiOf) {}

  value(): Promise<TransactionRequest> {
    return new Contract(this._aContractAddress, this._approveInterface()).populateTransaction.approve(
      this._aSpenderAddress,
      this._aWeiValue.value()
    );
  }

  private _approveInterface(): ethers.utils.Interface {
    return new ethers.utils.Interface(['function approve(address _spender, uint256 _value)']);
  }
}
