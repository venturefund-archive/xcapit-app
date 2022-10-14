import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Transaction } from '@solana/web3.js';


export interface BlockchainTx {
  value(): Promise<TransactionRequest | Transaction | any>;
}
