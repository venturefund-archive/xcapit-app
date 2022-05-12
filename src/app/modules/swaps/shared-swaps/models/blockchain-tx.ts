import { TransactionRequest } from "@ethersproject/abstract-provider";


export interface BlockchainTx {
  value(): Promise<TransactionRequest>;
}
