import { Injectable } from "@angular/core";
import { Connection } from "@solana/web3.js";
import { BlockchainTx } from "src/app/modules/swaps/shared-swaps/models/blockchain-tx";
import { Blockchain } from "src/app/modules/swaps/shared-swaps/models/blockchain/blockchain";
import { SolanaFeeOf } from "../solana-fee-of";


@Injectable({ providedIn: 'root' })
export class SolanaFeeOfInjectable {

  create(aTransaction: BlockchainTx, aBlockchain: Blockchain): SolanaFeeOf {
    return new SolanaFeeOf(
      aTransaction,
      new Connection(aBlockchain.rpc())
    );
  }
}
