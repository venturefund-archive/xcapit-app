import { Blockchain } from "../blockchain/blockchain";
import { Token } from "../token/token";
import { Tokens } from "../tokens/tokens";


export class BlockchainTokens implements Tokens {

  constructor(private _aBlockchain: Blockchain, private _tokens: Tokens) { }

  async value(): Promise<Token[]> {
    return (await this._tokens.value()).filter(token => token.blockchainId() === this._aBlockchain.id());
  }
}
