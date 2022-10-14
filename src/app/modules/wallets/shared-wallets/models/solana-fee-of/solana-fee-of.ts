import { Connection } from "@solana/web3.js";
import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { FakeConnection } from "src/app/modules/swaps/shared-swaps/models/fakes/fake-connection";
import { SolanaTxWithBlockhash } from "src/app/modules/wallets/shared-wallets/models/solana-tx-with-blockhash/solana-tx-with-blockhash";
import { SolanaTxWithPayer } from "src/app/modules/wallets/shared-wallets/models/solana-tx-with-payer/solana-tx-with-payer";


export class SolanaFeeOf {

  constructor(
    private _aTransaction: BlockchainTx,
    private _connection: Connection | FakeConnection
  ) { }

  async value(): Promise<number> {
    return await (
      await new SolanaTxWithBlockhash(
        new SolanaTxWithPayer(this._aTransaction),
        this._connection
      ).value()
    ).getEstimatedFee(this._connection as Connection);
  }
}
