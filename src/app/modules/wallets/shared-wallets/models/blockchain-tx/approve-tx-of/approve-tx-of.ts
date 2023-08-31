import { BlockchainTx } from "../blockchain-tx";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { Dex } from "src/app/modules/swaps/shared-swaps/models/dex";
import { Swap } from "src/app/modules/swaps/shared-swaps/models/swap/swap";


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
