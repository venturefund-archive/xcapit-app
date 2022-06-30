import { Injectable } from "@angular/core";
import { Blockchain } from "../../blockchain/blockchain";
import { Tokens } from "../../tokens/tokens";
import { BlockchainTokens } from "../blockchain-tokens";


@Injectable({ providedIn: 'root' })
export class BlockchainTokensFactory {

  create(aBlockchain: Blockchain, tokens: Tokens) {
    return new BlockchainTokens(aBlockchain, tokens);
  }
}
