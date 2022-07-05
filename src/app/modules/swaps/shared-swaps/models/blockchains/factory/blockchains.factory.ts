import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BlockchainRepo } from "../../blockchain-repo/blockchain-repo";
import { Blockchains } from "../blockchains";


@Injectable({ providedIn: 'root' })
export class BlockchainsFactory {

  create(blockchainData: any = environment.BLOCKCHAIN_DATA) {
    return new Blockchains(new BlockchainRepo(blockchainData));
  }
}
