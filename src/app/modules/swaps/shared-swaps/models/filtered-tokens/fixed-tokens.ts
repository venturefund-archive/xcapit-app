import { Tokens } from '../tokens/tokens';
import { Token } from '../token/token';


export class FixedTokens implements Tokens {
  constructor(private _tokens: Token[]) {}

  async value(): Promise<Token[]> {
    return this._tokens;
  }
}
