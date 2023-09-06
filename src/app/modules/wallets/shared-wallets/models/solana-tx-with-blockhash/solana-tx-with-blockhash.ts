import { Connection, Transaction } from "@solana/web3.js";
import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { BlockchainTx } from "../blockchain-tx/blockchain-tx";


export class SolanaTxWithBlockhash implements BlockchainTx {

  constructor(private _aTx: BlockchainTx, private _connection: Connection | FakeConnection) {}

  async value(): Promise<Transaction> {
    const tx = await this._aTx.value();
    tx.recentBlockhash = (await this._connection.getLatestBlockhash('finalized')).blockhash;
    return tx;
  }
}
