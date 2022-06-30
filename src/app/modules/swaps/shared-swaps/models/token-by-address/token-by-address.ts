import { Token } from "../token/token";
import { Tokens } from "../tokens/tokens";


export class TokenByAddress {

  constructor(private _aTokenAddress: string, private _fromTokens: Tokens) { }

  async value(): Promise<Token> {
    return (await this._fromTokens.value()).find(token => token.address() === this._aTokenAddress.toLocaleLowerCase());
  }
}
