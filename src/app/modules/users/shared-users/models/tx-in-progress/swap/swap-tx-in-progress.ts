import { NullTxHash } from 'src/app/modules/wallets/shared-wallets/models/tx-hash/null-tx-hash/null-tx-hash';
import { TxHash } from 'src/app/modules/wallets/shared-wallets/models/tx-hash/tx-hash.interface';
import { Transaction } from 'src/app/modules/wallets/shared-wallets/types/transaction.type';
import { TxInProgress } from '../tx-in-progress.interface';
import { IBlockchain } from '../../../../../swaps/shared-swaps/models/blockchain/blockchain';

export class SwapTxInProgress implements TxInProgress {
  constructor(private readonly _aBlockchain: IBlockchain, private readonly startTimestamp = new Date()) {}

  timestamp(): Date {
    return this.startTimestamp;
  }

  type(): Transaction {
    return 'swap';
  }

  blockchain(): IBlockchain {
    return this._aBlockchain;
  }

  hash(): TxHash {
    return new NullTxHash();
  }

  json() {
    return {
      type: this.type(),
      blockchain: this._aBlockchain.name(),
      timestamp: this.startTimestamp.toString(),
    };
  }
}
