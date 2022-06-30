import { Token } from "../token/token";
import { Tokens } from "../tokens/tokens";


export class IntersectedTokens implements Tokens {

  constructor(private _groupA: Tokens, private _groupB: Tokens) { }

  async value(): Promise<Token[]> {
    const groupA = await this._groupA.value();
    const groupB = await this._groupB.value();

    return groupA.filter(tokenA => {
      return groupB
        .find(tokenB =>
          tokenA.address() === tokenB.address());
      });
  }
}
