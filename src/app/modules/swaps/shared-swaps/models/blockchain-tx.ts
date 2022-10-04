import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Transaction, VersionedTransaction } from '@solana/web3.js';

export interface BlockchainTx {
  value(): Promise<Transaction>;
}
