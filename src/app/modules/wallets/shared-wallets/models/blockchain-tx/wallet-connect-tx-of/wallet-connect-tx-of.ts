import { BlockchainTx } from '../blockchain-tx';
import { TransactionRequest } from '@ethersproject/abstract-provider';

export class WalletConnectTxOf implements BlockchainTx {
  constructor(private _aRawTx: TransactionRequest) {}

  async value(): Promise<TransactionRequest> {
    return Promise.resolve(this._aRawTx);
  }
}
