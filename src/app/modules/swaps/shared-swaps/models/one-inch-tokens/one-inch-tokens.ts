import { Dex } from "../dex";
import { OneInchToken } from "../one-inch-token/one-inch-token";
import { Token } from "../token/token";
import { Tokens } from "../tokens/tokens";


export class OneInchTokens implements Tokens {

  private _cachedTokens: any;

  constructor(private _dex: Dex) { }

  async value(): Promise<Token[]> {
    const tokens = await this._tokens();
    return Object.keys(tokens.tokens).map(item => new OneInchToken(tokens.tokens[item]));
  }

  private async _tokens(): Promise<any> {
    if (!this._cachedTokens) {
      this._cachedTokens = await this._dex.tokens();
    }
    return this._cachedTokens;
  }
}
