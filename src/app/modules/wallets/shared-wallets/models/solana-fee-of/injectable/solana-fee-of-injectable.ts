import { Injectable } from "@angular/core";
import { Connection } from "@solana/web3.js";
import { Blockchain } from "src/app/modules/swaps/shared-swaps/models/blockchain/blockchain";
import { SolanaFeeOf } from "../solana-fee-of";
import { BlockchainTx } from "../../blockchain-tx/blockchain-tx";


@Injectable({ providedIn: 'root' })
export class SolanaFeeOfInjectable {

  create(transactions: BlockchainTx[], aBlockchain: Blockchain): SolanaFeeOf {
    return new SolanaFeeOf(
      transactions,
      new Connection(aBlockchain.rpc())
    );
  }
}
