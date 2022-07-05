import { TransactionRequest } from "@ethersproject/abstract-provider";
import { BlockchainTx } from "../blockchain-tx";


export class FakeBlockchainTx implements BlockchainTx {

  async value(): Promise<TransactionRequest> {
    return await Promise.resolve({});
  }
}
