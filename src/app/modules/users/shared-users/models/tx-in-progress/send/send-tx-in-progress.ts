import { Transaction } from 'src/app/modules/wallets/shared-wallets/types/transaction.type';
import { TxInProgress } from '../tx-in-progress.interface';
import { TxHash } from '../../../../../wallets/shared-wallets/models/tx-hash/tx-hash.interface';
import { IBlockchain } from '../../../../../swaps/shared-swaps/models/blockchain/blockchain';

export class SendTxInProgress implements TxInProgress {
  constructor(
    private readonly _aBlockchain: IBlockchain,
    private readonly _aHash: TxHash,
    private readonly startTimestamp = new Date()
  ) {}

  timestamp(): Date {
    return this.startTimestamp;
  }

  hash(): TxHash {
    return this._aHash;
  }

  type(): Transaction {
    return this._aBlockchain.name() !== 'SOLANA' ? 'send' : 'solana-send';
  }

  blockchain(): IBlockchain {
    return this._aBlockchain;
  }

  json() {
    return {
      type: this.type(),
      hash: this._aHash.value(),
      blockchain: this._aBlockchain.name(),
      timestamp: this.startTimestamp.toString(),
    };
  }
}
