import { TransactionResponse } from '@ethersproject/abstract-provider';
import { TransactionResponse as SolanaTransactionResponse } from '@solana/web3.js';

export interface Send {
  get tokenDecimals(): number;

  send(): Promise<SolanaTransactionResponse | TransactionResponse>;
}
