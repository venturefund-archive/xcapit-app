import { Transaction } from 'src/app/modules/wallets/shared-wallets/types/transaction.type';
import { TxHash } from '../../../../wallets/shared-wallets/models/tx-hash/tx-hash.interface';
import { IBlockchain } from '../../../../swaps/shared-swaps/models/blockchain/blockchain';

export interface TxInProgress {
  timestamp: () => Date;
  hash: () => TxHash;
  type: () => Transaction;
  blockchain: () => IBlockchain;
  json: () => any;
}
