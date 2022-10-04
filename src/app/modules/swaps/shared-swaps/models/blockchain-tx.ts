import { TransactionRequest } from '@ethersproject/abstract-provider';
import { VersionedTransaction } from '@solana/web3.js';

export interface BlockchainTx {
  value(): Promise<TransactionRequest | VersionedTransaction>;
}
