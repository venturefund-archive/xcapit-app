import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Transaction } from "@solana/web3.js";
import { BlockchainTx } from "../blockchain-tx";


export class FakeBlockchainTx implements BlockchainTx {

  constructor(private _returnValue: any = {}) {}

  async value(): Promise<Transaction | TransactionRequest | any> {
    return await Promise.resolve(this._returnValue);
  }
}
