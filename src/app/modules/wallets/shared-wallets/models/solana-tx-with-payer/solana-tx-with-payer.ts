import { Transaction } from "@solana/web3.js";
import { BlockchainTx } from "../blockchain-tx/blockchain-tx";


export class SolanaTxWithPayer implements BlockchainTx {
  constructor(private _aBlockchainTx: BlockchainTx) {}

  async value(): Promise<Transaction> {
    const tx = await this._aBlockchainTx.value();
    tx.feePayer = tx.keys[0];
    return tx;
  }
}
