import { Injectable } from '@angular/core';
import { Connection } from '@solana/web3.js';
import { IBlockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';


@Injectable({ providedIn: 'root' })
export class SolanaConnectionInjectable {
  create(aBlockchain: IBlockchain) {
    return new Connection(aBlockchain.rpc());
  }
}
