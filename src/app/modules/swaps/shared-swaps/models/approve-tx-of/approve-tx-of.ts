import { BlockchainTx } from "../blockchain-tx";
import { Swap } from "../swap/swap";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Dex } from "../dex";
import { BigNumber } from "ethers";


export class ApproveTxOf implements BlockchainTx {

  constructor(private aSwap: Swap, private inDex: Dex) { }

  async value(): Promise<TransactionRequest> {
    const approve = await this.inDex.approve(this.aSwap);
    return {
      ...approve,
      gasPrice: BigNumber.from(approve.gasPrice),
      value: BigNumber.from(approve.value),
    };
  }
}
