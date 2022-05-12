import { BlockchainTx } from "../blockchain-tx";
import { Swap } from "../swap/swap";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Dex } from "../dex";


export class ApproveTxOf implements BlockchainTx {

  constructor(private aSwap: Swap, private inDex: Dex) { }

  value(): Promise<TransactionRequest> {
    return this.inDex.approve(this.aSwap);
  }
}
